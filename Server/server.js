const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

var admin = require("firebase-admin");

var serviceAccount = require("./private key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
async function hashPassword(plainPassword) {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
}

// async function getCustomers() {
//     try {
//       const snapshot = await db.collection('Customer').get();
      
//       snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//       });
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
// }
const comparePassword = async (email, providedPassword) => {
  try {
      // Fetch user document by email
      const snapshot = await db.collection('Users')
          .where('email', '==', email)
          .get();

      if (snapshot.empty) {
          console.log('No user found with the provided email.');
          return false;
      }

      let hashedPassword;
      snapshot.forEach(doc => {
          hashedPassword = doc.data().password; // Assuming 'password' field stores the hash
      });

      // Compare provided password with hashed password
      const isMatch = await bcrypt.compare(providedPassword, hashedPassword);

      if (isMatch) {
          console.log('Password match!');
          return true;
      } else {
          console.log('Incorrect password.');
          return false;
      }
  } catch (error) {
      console.error('Error comparing password:', error);
      return false;
  }
};
  



const app = express();
const port = 5000;

app.use(cors());  
app.use(bodyParser.json());  

app.post('/api/signUP', async (req, res) => {
  const { name, email, password, Rname, phone, dob, selectedType, Petbreed, PetName, PetAge } = req.body;
  const hashedPassword = await hashPassword(password);
  // Check if all required fields are provided
  if (!name || !email || !selectedType || !Petbreed || !PetName || !PetAge) {
    return res.status(400).send({ message: "All fields are required" });
  }
  else{
    
    try {
      
      const docRef =db.collection('Users').doc();  // Firestore document reference
  
      await docRef.set({
        userName: name,
        email: email,
        password: hashedPassword,
        RealName: Rname,
        DOB: dob,
        phone: phone,
      });
      const petRef=docRef.collection("pet").doc();
      await petRef.set({
        PetType: selectedType,
        PetBreed: Petbreed,
        PetName: PetName,
        PetAge: PetAge
      })
  
      res.status(200).send({ message: "Details saved successfully" });
    } catch (error) {
      console.error("Error saving pet details:", error);
      res.status(500).send({ message: "Error saving pet details" });
    }

  }

 
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const isPasswordCorrect = await comparePassword(email, password);

      if (isPasswordCorrect) {
        // Fetch user document by email
        const snapshot = await db.collection('Users').where('email', '==', email).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0]; // Assuming one user per email
          const userId = userDoc.id;
          const userData = { id: userId, ...userDoc.data() };

          // Fetch associated pet data
          const petSnapshot = await db.collection('Users')
            .doc(userId)
            .collection('pet')
            .get();

          const petData = petSnapshot.docs.map(petDoc => ({ id: petDoc.id, ...petDoc.data() }));

          userData.pets = petData; // Attach pet data to user data

          // Return user data including pets
          return res.status(200).send({
            message: 'Login successful',
            user: userData,
          });
        } else {
          return res.status(404).send({ message: 'User not found' });
        }
      } else {
        return res.status(401).send({ message: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  } else {
    return res.status(400).send({ message: 'Invalid credentials' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

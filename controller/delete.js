const localStorage = require("localStorage");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const password = "Aarif@123";
const hash = "$2b$10$p7DHTXcXXJkNKECB/ohc8.iS2d5GoWKRucltv//Mv2yGYahDkz2hm";



// bcrypt.genSalt(saltRounds, function(err, salt) {  
//     bcrypt.hash(password, salt, function(err, hash) {
// console.log(hash)
//     });
//   });

//   console.log(password)
    // bcrypt.hash(password, saltRounds).then(hash => console.log(hash))

    bcrypt.hash(password, saltRounds).then(hash => console.log(hash))

bcrypt.compare(password, hash, function(err, result) {
    console.log(result)
});
    



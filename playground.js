const jwt = require('jsonwebtoken');

const token = jwt.sign({ data: 'selam' }, 'secret');
console.log(token);
console.log(Date.now());
const d = new Date(1617648344055).toString();
console.log(d);

jwt.verify(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoic2VsYW0iLCJpYXQiOjE2MTc2NDgyODl9.5-oJBYqnd2e7G2_oT1QhwCPPkoJ75e-WgafS_73HNq8',
  'secret',
  function (err, data) {
    if (err) {
      console.error(err);
    }

    console.log(data);
  },
);

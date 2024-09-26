const form = document.getElementById('user-form');
const numUsersInput = document.getElementById('num-users');
const csvDownloadDiv = document.getElementById('csv-download');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const numUsers = parseInt(numUsersInput.value);
  const userData = [];

  for (let i = 0; i < numUsers; i++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`
    };
    userData.push(user);
  }

  const csvContent = userData.map((user) => Object.values(user).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  a.textContent = 'Download CSV file';
  csvDownloadDiv.appendChild(a);
});
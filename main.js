document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const options = {
        method: 'POST',
        headers: {
            accept: '*/*',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: new URLSearchParams({
            username: username,
            password: password,
            grant_type: 'password',
            client_id: '876dab2190464884bf9b092aa1407585',
            device_uid: 'ede2c451f81e8a6f6ea873f552ad0612'
        })
    };

    fetch('https://www.nuinvest.com.br/api/auth/v3/security/token', options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            localStorage.setItem('token', response.access_token);
            window.location.href = "requests.html";
        })
        .catch(err => console.error(err));
    // Aqui você pode adicionar a lógica para lidar com o login
    // e fazer a chamada para a API.
});
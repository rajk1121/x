const url = window.location.href;
const purl = url.split('/')[3].split('?')[1];
console.log(purl);
let form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let password = document.getElementById('password').value;
        let cpassword = document.getElementById('cpassword').value;
        let obj = {
            "password": password,
            "confirmPassword": cpassword

        }
        axios.patch('api/user/resetPassword?' + purl, obj).then((res) => {
            alert(res.data);
            location.assign('/');
        })
    })
}
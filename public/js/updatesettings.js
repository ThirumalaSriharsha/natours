const updateSettings=async (data,type)=>
{
   try{
         
        const url = 
        type  === 'password' 
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword':
         'http://127.0.0.1:3000/api/v1/users/updateMe';
         
        const res = await  axios({
            method:'PATCH',
            url,
            data        
        }) ;
        console.log(data);
        if(res.data.Status === 'sucessful'||res.data.status === 'sucessful')
        //                      sucessful        
        {
            console.log("sucess");
            alert(`${type.toUpperCase()} updated sucessfully`);
            
        }           
}
    catch(err)
    {
        alert('error',err.response.data.message);

    }
};

document.querySelector('.form-user-data').addEventListener('submit',e=>
{
    e.preventDefault();
    const form=new FormData();
    form.append('name',document.getElementById('name').value)
    form.append('email',document.getElementById('email').value)
    form.append('photo',document.getElementById('photo').files[0])
    console.log(form)
    updateSettings(form,'data');
}
);

document.querySelector('.form-user-password').addEventListener('submit', async e=>
{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent='updating.....'
    const currentPasword=document.getElementById('password-current').value;
    const password=document.getElementById('password').value;
    const passwordConformation=document.getElementById('password-confirm').value;
    await updateSettings({currentPasword,password,passwordConformation},'password');
    document.querySelector('.btn--save-password').textContent='save password'
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirm').value='';

}
);
// "currentPasword":"12345678",
// "password":"123456789",
// "passwordConformation":"123456789"
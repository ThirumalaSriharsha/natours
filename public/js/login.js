// import { showAlert} from './alerts';
 const login=async (email,password)=>
{

 try
  {
    const res=await axios({
        method:'POST',
        url:'http://127.0.0.1:3000/api/v1/users/login',
        data:
        {
            email,
            password
        }
    });
   if(res.data.status === 'sucessful')
   {
    alert('success','logged in sucessfully');
    window.setTimeout(()=>
    {
        location.assign('/');
            },1500);
   }
  }

  catch(err)
  {
    alert('error',err.response.data.message);
  }
};

const logout=async()=>
{
   console.log('you are in log out');
 try
  {
    const res=await axios({
        method:'GET',
        url:'http://127.0.0.1:3000/api/v1/users/logout'
             
    });
   if(res.data.status = 'success') 
   {
    location.reload(true);
    alert('log out sucessfull');

   }
  
  }
  catch(err)
  {
    alert('error','error looging out try again');
  }
};

document.querySelector('.form--login').addEventListener('submit',e=>
{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email,password);
}
);

document.querySelector('.nav__el--logout').addEventListener('click',logout);
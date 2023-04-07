const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:[true,'a name must be given']       
                    
        },
        email:
        {
            type:String,
            require:[true,'you must provied your email address'],
            unique:true,
            lowercase:true,
            validate: [validator.isEmail,'please enter a validate email']
        },
        photo: [String],
        password:
        {
            type: String,
            required:[true,'please provide a password'],
            minlength:[8,'password must  have minimum 8 charactes'],
            select:false

        },
        passwordConformation:
        {
            type: String,
            required:[true,'please provide a conform your password'],
            validate:
           {
                validator :function(el) 
                {
                    return el === this.password
                },
            
             message : 'conformed password not matching with the given password '
            },   select:false
            
        }

    }
);
//run this function if password is modified
userSchema.pre('save',async function(next)
{
   if(!this.isModified('password'))
   return next();  
    // hash the password with cost 12  
   this.password= await bcrypt.hash(this.password,12);
// the conformation password is undefined  
   this.passwordConformation=undefined;
   next();
 
}
);
userSchema.methods.correctPassword=async function( candidatePassword ,userPassword )
{
    return await bcrypt.compare(candidatePassword ,userPassword);
}
const User= mongoose.model('User',userSchema);
module.exports=User;
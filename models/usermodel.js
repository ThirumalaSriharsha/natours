const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const userSchema = new mongoose.Schema(
    {
        passwordChangedAt: Date,
        passwordResetToken:
        {type: String},
        passwordResetExpires:
        {
            type:Date   
        }, 
        name:
        {
            type:String,
            required:[true,'a name must be given']       
                    
        },
     
        role:
        {
            type:String,
            enum:['user','guide','lead-guide','admin'],
            default:'user'
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
};

// this is a function which is used to check wheather the password has been changed after the issue of tokeen
userSchema.methods.changedPasswordAfter = function( JWTTimestamp)
{
    // need to fix this error
    // the code is getting error : 
    // the "this.passwordChangedAt" is defined as undefined
    // const changedTimeStamp=parseInt(this.passwordChangedAt.getTime())/1000;
//    console.log(this.passwordChangedAt,JWTTimestamp);
//        if(this.passwordChangedAt) 
//     {
     
//         console.log(this.passwordChangedAt,JWTTimestamp);
//           return changedTimeStamp<JWTTimestamp    
//  }
        return false;
};
userSchema.methods.createPasswordResetToken=function()
{
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
};

const User= mongoose.model('User',userSchema);
module.exports=User;
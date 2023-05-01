// const stripe=Stripe('pk_test_51N2ZntSChFSlSnR3ZojmQYiNy7in6Y4soVJLKnm9AgwuyTHW6ACiz7EfacxAixlwcef8tjREofYIGcBxWcs6Hu3q00mWJq0kWS')
const bookTour = async tourId =>
{
    try{
    const session = await axios(`http://127.0.0.1:3000/api/v1/booking/Checkout-session/${tourId}`);
    console.log(session);
    // 2)credit  card paymnets

    await stripe.redirectToCheckout(
        {
            sessionId: session.data.session.id
        }
    )
    }
    catch(err)
    {
        alert('error');
    }

}

const bookBtn=document.getElementById(book-tour);
if(bookBtn) 
bookBtn.addEventListener('click',e=>
{    
    e.target.textContent='....processing';
    const { tourId} =e.target.dataset;
    bookTour(tourId);
});
 
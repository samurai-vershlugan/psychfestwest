document.getElementById('year').textContent=new Date().getFullYear();

const signup=document.getElementById('signup-button');
if(signup && signup.getAttribute('href').startsWith('SET-')){
  signup.addEventListener('click',e=>{
    e.preventDefault();
    alert('Connect your Brevo signup form before publishing.');
  });
}

/* Tiny bit of intentional chaos: clicking random tiles makes them jump */
document.querySelectorAll('.tile').forEach(tile=>{
  tile.addEventListener('click',()=>{
    tile.animate([
      {transform:'rotate(0deg) scale(1)'},
      {transform:'rotate(7deg) scale(1.08)'},
      {transform:'rotate(-5deg) scale(.96)'},
      {transform:'rotate(0deg) scale(1)'}
    ],{duration:500,easing:'ease-out'});
  });
});





// burger menu
const burgericon = document.querySelector("#burger")
const navbarMenu = document.querySelector('#nav-links')

burgericon.addEventListener('click', () =>{
    navbarMenu.classList.toggle('is-active')
    event.preventDefault();
})
//tabs
const tabs = document.querySelectorAll('.tabs li')
console.log(tabs)
const tabContentBoxes = document.querySelectorAll('#tab-content > div')

tabs.forEach((e) =>{
   e.addEventListener('click', () => {
     tabs.forEach( item => {
        item.classList.remove('is-active')
        e .classList.add('is-active')

        const target = e.dataset.target;
        console.log(target)
        tabContentBoxes.forEach((x,i) =>{
            if(x.getAttribute('id') == target){
                x.classList.remove('is-hidden')
            }else{
                x.classList.add('is-hidden')
            }
        })
     })
    })
})

// calendar


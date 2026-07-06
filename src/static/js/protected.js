const contentMain = document.querySelector('main .container')

async function seeData(){
  const result = await fetch('/notes')

  if(!result.ok){
    return console.log('no tenemos acceso')
  } 
  
  const data = await result.json()

  contentMain.textContent = JSON.stringify(data)
}

seeData()
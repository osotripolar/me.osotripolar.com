export function el(tag = 'p', className = undefined, content = undefined){
  const el = document.createElement(tag)

  if(className){
    el.className = className
  }

  if(content){
    el.textContent = content
  }

  return el
}
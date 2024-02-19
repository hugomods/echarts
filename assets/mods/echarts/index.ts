import * as echarts from 'mods/echarts/echarts.js'

(() => {
  const init = (ele: Element): Promise => {
    return new Promise((resolve) => {
      if (ele.classList.contains('initializing') || ele.classList.contains('initialized')) {
        resolve(false)
      }

      ele.classList.add('initializing')
      const option = JSON.parse(ele.getAttribute('data-options') ?? '{}')
      echarts.init(ele).setOption(option)
      ele.classList.remove('initializing')
      ele.classList.add('initialized')
      resolve(true)
    })
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        init(entry.target).then(() => {
          observer.unobserve(entry.target)
        })
      }
    })
  })

  const charts = document.querySelectorAll('.echarts')
  charts.forEach((ele) => {
    observer.observe(ele)
  })

  window.addEventListener('resize', () => {
    charts.forEach((ele) => {
      echarts.getInstanceByDom(ele)?.resize()
    })
  })
})()

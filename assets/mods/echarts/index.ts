import * as echarts from 'mods/echarts/echarts.js'

declare global {
  interface Window {
    echarts: any
  }
}

(() => {
  window.echarts = echarts

  const init = (ele: Element): Promise => {
    return new Promise((resolve) => {
      if (ele.classList.contains('initializing') || ele.classList.contains('initialized')) {
        resolve(false)
      }

      ele.classList.add('initializing')
      let option = {}
      const optionVar = ele.getAttribute('data-echarts-options-var')
      if (optionVar !== null) {
        option = window[optionVar]
      } else {
        option = JSON.parse(ele.getAttribute('data-echarts-options') ?? '{}')
      }
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

  document.addEventListener('DOMContentLoaded', () => {
    const charts = document.querySelectorAll('.echarts')
    charts.forEach((ele) => {
      observer.observe(ele)
    })

    window.addEventListener('resize', () => {
      charts.forEach((ele) => {
        echarts.getInstanceByDom(ele)?.resize()
      })
    })
  })
})()

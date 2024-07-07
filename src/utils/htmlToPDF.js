// 页面导出为pdf格式 //title表示为下载的标题，html表示document.querySelector('#myPrintHtml')
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
var noTableHeight = 0 //table外的元素高度

export const htmlPdf = (title, html, fileList, type) => {// type传有效值pdf则为横版
  if (fileList) {
    const pageHeight = Math.floor(277 * html.scrollWidth / 190) + 20 //计算pdf高度
    for (let i = 0; i < fileList.length; i++) { //循环获取的元素
      const multiple = Math.ceil((fileList[i].offsetTop + fileList[i].offsetHeight) / pageHeight) //元素的高度
      if (isSplit(fileList, i, multiple * pageHeight)) { //计算是否超出一页
        var _H = '' //向pdf插入空白块的内容高度
        if (fileList[i].localName !== 'tr') { //判断是不是表格里的内容
          _H = multiple * pageHeight - (fileList[i].offsetTop + fileList[i].offsetHeight)
        } else {
          _H = multiple * pageHeight - (fileList[i].offsetTop + fileList[i].offsetHeight + noTableHeight) + 20
        }
        var newNode = getFooterElement(_H)  //向pdf插入空白块的内容
        const divParent = fileList[i].parentNode // 获取该div的父节点
        const next = fileList[i].nextSibling // 获取div的下一个兄弟节点
        // 判断兄弟节点是否存在
        if (next) {
          // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
          divParent.insertBefore(newNode, next)
        } else {
          // 否则向节点添加最后一个子节点
          divParent.appendChild(newNode)
        }
      }
    }
  }
  html2Canvas(html, {
    allowTaint: false,
    taintTest: false,
    logging: false,
    useCORS: true,
    dpi: window.devicePixelRatio * 1,
    scale: 1 // 按比例增加分辨率
  }).then(canvas => {
    var pdf = new JsPDF('p', 'mm', 'a4') // A4纸，纵向
    var ctx = canvas.getContext('2d')
    var a4w = type ? 277 : 190; var a4h = type ? 190 : 277 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
    var imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
    var renderedHeight = 0
    while (renderedHeight < canvas.height) {
      var page = document.createElement('canvas')
      page.width = canvas.width
      page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页

      // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
      page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
      pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距

      renderedHeight += imgHeight
      if (renderedHeight < canvas.height) {
        pdf.addPage()// 如果后面还有内容，添加一个空页
      }
      // delete page;
    }
    // 保存文件
    pdf.save(title + '.pdf')
  })
}
// pdf截断需要一个空白位置来补充
const getFooterElement = (remainingHeight, fillingHeight = 0) => {
  const newNode = document.createElement('div')
  newNode.style.background = '#ffffff'
  newNode.style.width = 'calc(100% + 8px)'
  newNode.style.marginLeft = '-4px'
  newNode.style.marginBottom = '0px'
  newNode.classList.add('divRemove')
  newNode.style.height = (remainingHeight + fillingHeight) + 'px'
  return newNode
}
const isSplit = (nodes, index, pageHeight) => {
  // 判断是不是tr 如果不是高度存起来
  // 表格里的内容要特殊处理
  // tr.offsetTop 是tr到table表格的高度
  // 所以计算高速时候要把表格外的高度加起来
  // 生成的pdf没有表格了这里可以不做处理 直接计算就行
  if (nodes[index].localName !== 'tr') {  //判断元素是不是tr
    noTableHeight += nodes[index].clientHeight
  }

  if (nodes[index].localName !== 'tr') {
    return nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
  } else {
    return nodes[index].offsetTop + nodes[index].offsetHeight + noTableHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight + noTableHeight > pageHeight
  }
}

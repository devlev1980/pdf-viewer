const url  = '../docs/pdf.pdf';

let pdfDoc = null,
pageNum = 1,
pageIsRendering = false,
pageNumIsPending = null;

const scale =2,
      canvas = document.querySelector('#pdf-render'),
      ctx = canvas.getContext('2d');

let pageCount = document.querySelector('#page-count');      

// Render Page 
const renderPage = (num)=>{
    pageIsRendering = true;

    //Get Page
    pdfDoc.getPage(num).then(page=>{
        console.log('Get Page',page);
        // Set scale
        const viewport = page.getViewport({scale:scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext:ctx,
            viewport
        }
        page.render(renderCtx).promise.then(()=>{
            pageIsRendering = false;
            if(pageNumIsPending !==null){
                renderPage(pageIsRendering);
                pageNumIsPending = null
            }
        });
        // Output current page 
        document.querySelector('#page-num').textContent = num;
    })
}
// Check for pages rendering 
const queuerenderPage =  (num)=>{
    if(pageIsRendering){
        pageNumIsPending = num;
    }else{
        renderPage(num);
    }
} 
// Show previous page
const showPreviousPage = ()=>{
    if(pageNum<=1){
        return;
    }else{
       pageNum--;
       queuerenderPage(pageNum) 
    }
} 
// Show next page 
const showNextPage = ()=>{
        if(pageNum>=pdfDoc.numPages){
            return;
        }else{
           pageNum++;
           queuerenderPage(pageNum) 
        }
}

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_=>{
    pdfDoc = pdfDoc_;
    console.log('Pdf from mozilla',pdfDoc);
    pageCount.textContent = pdfDoc.numPages;
    renderPage(pageNum);
}).catch(err=>{
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div,canvas);

    // Removing top bar
    document.querySelector('.top-bar').style.display = 'none'
})

// Button events
document.querySelector('#prev-page').addEventListener('click',showPreviousPage);
document.querySelector('#next-page').addEventListener('click',showNextPage)
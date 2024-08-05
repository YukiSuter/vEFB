// Drag scroll behaviour
document.addEventListener('DOMContentLoaded', function () {
    const scrollableContainer = document.getElementById('scrollable-container');
    const scrollableIframe = document.getElementById('scrollable-iframe');
    
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    scrollableContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        scrollableContainer.classList.add('active');
        startX = e.pageX - scrollableContainer.offsetLeft;
        startY = e.pageY - scrollableContainer.offsetTop;
        scrollLeft = scrollableIframe.contentWindow.document.documentElement.scrollLeft;
        scrollTop = scrollableIframe.contentWindow.document.documentElement.scrollTop;
    });

    scrollableContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollableContainer.classList.remove('active');
    });

    scrollableContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollableContainer.classList.remove('active');
    });

    scrollableContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollableContainer.offsetLeft;
        const y = e.pageY - scrollableContainer.offsetTop;
        const walkX = (x - startX) * 2; // Scroll-fast
        const walkY = (y - startY) * 2; // Scroll-fast
        scrollableIframe.contentWindow.scrollTo(scrollLeft - walkX, scrollTop - walkY);
    });
});

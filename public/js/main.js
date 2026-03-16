 const items = document.querySelectorAll('.main-nav > ul > li.has-dd');
 
  items.forEach(function(li) {
    li.querySelector('.nav-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = li.classList.contains('open');
      items.forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) li.classList.add('open');
    });
  });
 
  document.addEventListener('click', function() {
    items.forEach(function(i) { i.classList.remove('open'); });
  });
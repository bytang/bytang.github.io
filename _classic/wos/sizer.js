(function(){
  var story = document.getElementById('story'),
    writer = document.getElementById('writer');

  story.style.height = Math.floor(Math.max(0, window.innerHeight - 120)).toString() + 'px';
  window.onresize = function() {
    story.style.height = Math.floor(Math.max(0, window.innerHeight - 120)).toString() + 'px';
  }    
})();
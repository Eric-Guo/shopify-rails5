(function () {
  function appendStylesheet() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `//ericguo.ggrok.com/jquery.slotmachine.css`;
    document.head.appendChild(link);
  }

  appendStylesheet();
  $(".price-item--regular").append("<div id='planeMachine' style='overflow: hidden;'>");
  $('#planeMachine2').slotMachine({
    active: 1,
    delay: 450,
    auto: 1500,
    randomize() {
      return this.nextIndex;
    }
  });
})();

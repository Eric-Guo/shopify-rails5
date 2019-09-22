(function () {
  function appendStylesheet() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `//ericguo.ggrok.com/jquery.slotmachine.css`;
    document.head.appendChild(link);
  }

  appendStylesheet();
  $(".price__regular").parent().parent().append(`<div id='planeMachine'>
      <div>
        <span class="badge">¥72</span> 美女给你
      </div>
      <div>
        <span class="badge">¥30</span> 女仆舔你
      </div>
      <div>
        <span class="badge">¥40</span> 二房要你
      </div>
      <div>
        <span class="badge">¥60</span> 小三作你
      </div>
    </div>`);
  $('#planeMachine').slotMachine({
    active: 1,
    delay: 450,
    auto: 1500,
    randomize() {
      return this.nextIndex;
    }
  });
})();

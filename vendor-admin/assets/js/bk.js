/* Add Horse popup logic */
(function(){
  // create modal markup once
  function createModal(){
    var modal = document.getElementById('horseModal');
    var overlay = document.getElementById('horseModalOverlay');
    var created = false;
    if(!modal){
      created = true;
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'horseModalOverlay';

      modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'horseModal';
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.innerHTML = '\n      <h3 id="horseModalTitle">Add Horses</h3>\n      <div class="fields">\n        <label>Race name:<br><input type="text" id="modal_race_name" /></label>\n        <label>Number of horses:<br>\n          <select id="modal_horse_count">'+
        (function(){var s=''; for(var i=4;i<=18;i++){s+='<option value="'+i+'">'+i+'</option>'} return s})()+
        '</select>\n        </label>\n      </div>\n      <div id="modal_horse_inputs" style="margin-top:12px"></div>\n      <div class="actions">\n        <button type="button" id="modal_cancel">Cancel</button>\n        <button type="button" id="modal_ok">Ok</button>\n      </div>';

      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    }

    // If already initialized, don't attach handlers again
    if(overlay.dataset && overlay.dataset.initialized==='1') return;

    // handlers
    var count = document.getElementById('modal_horse_count');
    var inputsWrap = document.getElementById('modal_horse_inputs');
    // persistent storage for race horse data
    window.__raceHorseData = window.__raceHorseData || [];

    function renderHorseInputs(){
      var n = parseInt(count.value,10)||0;
      inputsWrap.innerHTML='';
      var ctx = parseInt(modal.dataset.ctxRaceIndex,10);
      var stored = (typeof ctx === 'number' && !isNaN(ctx) && window.__raceHorseData[ctx]) ? window.__raceHorseData[ctx].names || [] : [];
      for(var i=1;i<=n;i++){
        var div = document.createElement('div');
        div.className = 'horse-input';
        var lbl = document.createElement('label'); lbl.textContent = i + '. Horse name:';
        var inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'modal_horse_name'; inp.dataset.index = (i-1);
        inp.placeholder = 'Horse name';
        if(stored[i-1]) inp.value = stored[i-1];
        div.appendChild(lbl);
        div.appendChild(inp);
        inputsWrap.appendChild(div);
      }
    }
    count.addEventListener('change', renderHorseInputs);
    renderHorseInputs();

    var modalOk = document.getElementById('modal_ok');
    var modalCancel = document.getElementById('modal_cancel');

    // validation: Ok disabled until race name and all horse inputs are filled
    function validateModal(){
      var raceName = document.getElementById('modal_race_name').value.trim();
      var horseInputs = Array.prototype.slice.call(inputsWrap.querySelectorAll('.modal_horse_name'));
      if(!raceName) { modalOk.disabled = true; return; }
      if(horseInputs.length === 0){ modalOk.disabled = true; return; }
      var allFilled = horseInputs.every(function(i){ return i.value.trim().length > 0; });
      modalOk.disabled = !allFilled;
    }

    // attach input listeners after rendering inputs
    function attachInputListeners(){
      var horseInputs = Array.prototype.slice.call(inputsWrap.querySelectorAll('.modal_horse_name'));
      horseInputs.forEach(function(inp){ inp.removeEventListener('input', validateModal); inp.addEventListener('input', validateModal); });
      // also validate on race name change
      var raceInput = document.getElementById('modal_race_name');
      raceInput.removeEventListener('input', validateModal); raceInput.addEventListener('input', validateModal);
      validateModal();
    }

    // ensure renderHorseInputs calls attachInputListeners afterwards
    var originalRender = renderHorseInputs;
    renderHorseInputs = function(){ originalRender(); attachInputListeners(); };

    // ensure modal ok/cancel refs and attach listeners immediately
    modalOk.disabled = true;
    // attach listeners for current inputs (in case render already ran)
    attachInputListeners();
    validateModal();

    modalOk.addEventListener('click', function(){
      var ctx = parseInt(modal.dataset.ctxRaceIndex,10);
      if(isNaN(ctx)) return closeModal();
      var raceEl = document.querySelectorAll('.race')[ctx];
      if(!raceEl) return closeModal();
      var raceName = document.getElementById('modal_race_name').value.trim();
      // collect horse names (allow at least one)
      var names = Array.prototype.slice.call(inputsWrap.querySelectorAll('.modal_horse_name')).map(function(i){return i.value.trim()}).filter(Boolean);
      if(names.length === 0){
        alert('Please enter at least one horse name.');
        return;
      }
      // save to storage
      window.__raceHorseData[ctx] = { raceName: raceName, names: names };
      // if race name provided, update the race input
      if(raceName){
        var input = raceEl.querySelector('input[type="text"]');
        if(input) input.value = raceName;
      }
      // render under race
      var list = raceEl.querySelector('.horse-list');
      if(!list){ list = document.createElement('ul'); list.className='horse-list'; raceEl.appendChild(list); }
      list.innerHTML = '';
      names.forEach(function(nm){ var li=document.createElement('li'); li.textContent = nm; list.appendChild(li); });
      // enable next race: increment number_of_races if possible
      var select = document.getElementById('number_of_races');
      if(select){
        var total = document.querySelectorAll('.race').length;
        var cur = parseInt(select.value,10) || 0;
        if(cur < total){
          // set to next value and fire change to enable fields
          select.value = Math.min(total, cur + 1);
          select.dispatchEvent(new Event('change'));
        }
      }
      closeModal();
    });

    modalCancel.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });

    function closeModal(){ overlay.classList.remove('open'); modal.removeAttribute('data-ctx-race-index'); }
    function openModal(idx, raceName){
      modal.dataset.ctxRaceIndex = idx;
      // load stored data if present
      var stored = window.__raceHorseData && window.__raceHorseData[idx];
      if(stored && stored.raceName){ document.getElementById('modal_race_name').value = stored.raceName; }
      else { document.getElementById('modal_race_name').value = raceName || ''; }
      // set count to previously saved length or default 4
      var cnt = (stored && stored.names && stored.names.length) ? Math.max(4, Math.min(18, stored.names.length)) : 4;
      document.getElementById('modal_horse_count').value = cnt;
      // attach ctx before rendering so renderHorseInputs can fill values
      document.getElementById('modal_horse_count').dispatchEvent(new Event('change'));
      // if stored, render will pick up stored names because modal.dataset.ctxRaceIndex is set
      overlay.classList.add('open');
    }

    // expose open function
    window.__openHorseModal = openModal;
    // mark initialized to avoid re-attaching handlers
    try{ overlay.dataset.initialized = '1'; }catch(e){}
  }

  // attach click handlers to Add Horse links
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('.add_horse_popup');
    if(!a) return;
    e.preventDefault();
    var raceEl = a.closest('.race');
    if(!raceEl) return;
    createModal();
    // find index of race
    var races = Array.prototype.slice.call(document.querySelectorAll('.race'));
    var idx = races.indexOf(raceEl);
    var currentRaceName = raceEl.querySelector('input[type="text"]') ? raceEl.querySelector('input[type="text"]').value : '';
    window.__openHorseModal(idx, currentRaceName);
  });

})();
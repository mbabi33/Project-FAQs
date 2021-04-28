// standard, cacheable elements
var timeout = 0; // used for debounce on search
var CONTAINER_SEL = '.t-Form-fieldContainer';
var pagePrefix = 'P' + $('#pFlowStepId').val();
var displayAsId = pagePrefix + '_DISPLAY_AS';
var $displayAs = $('#' + displayAsId);
var $body = $('.t-PageBody');
var $search = $('#' + pagePrefix + '_SEARCH');
var $sort = $('#' + pagePrefix + '_SORT');
var $reset = $('#reset_button');
var $cardsReg = $('#cards_region');
var $reportReg = $('#report_region');
var $gridReg = $('#grid_region');

// custom items (will vary by page)
var $territory = $('#' + pagePrefix + '_TERRITORY_ID');
var $account = $('#' + pagePrefix + '_ACCOUNT_ID');
var $show = $('#' + pagePrefix + '_SHOW');
var $quarter = $('#' + pagePrefix + '_QUARTER');

function showLeftColumn() {
  $body
    .removeClass('t-PageBody--hideLeft')
    .addClass('t-PageBody--showLeft');
    
  // Takes 200ms to hide column
  setTimeout(function() {
    // Ensure column headers align correctly
    $(window).trigger('apexwindowresized');
  }, 250);
}

function hideLeftColumn() {
  $body
    .removeClass('t-PageBody--showLeft')
    .addClass('t-PageBody--hideLeft');
    
  // Takes 200ms to hide column
  setTimeout(function() {
    // Ensure column headers align correctly
    $(window).trigger('apexwindowresized');
  }, 250);
}
  
// applyFilters triggers the refresh event on the correct region
function applyFilters() {
  var display = $v(displayAsId);
  
  if (display === 'CARDS') {
    $cardsReg.trigger('apexrefresh');
  } else if (display === 'REPORT') {
    $reportReg.trigger('apexrefresh');
  } else if (display === 'GRID') {
    $gridReg.trigger('apexrefresh');
  }
}

// toggleRegionDisplay is similar to applyFilters except that it also
// takes into account what regions or items need to be displayed or hidden
function toggleRegionDisplay(refresh) {
  var display = $v(displayAsId);
  
  refresh = (refresh === false) ? false : true;
  
  if (display === 'CARDS') {
    $reportReg.hide();
    $gridReg.hide();

    showLeftColumn();

    $sort.closest(CONTAINER_SEL).show();

    if (refresh) {
      $cardsReg.trigger('apexrefresh');
    }
    
    $cardsReg.show();
  } else if (display === 'REPORT') {
    $sort.closest(CONTAINER_SEL).hide();
    $cardsReg.hide();
    $gridReg.hide();

    showLeftColumn();

    if (refresh) {
      $reportReg.trigger('apexrefresh');
    }

    $reportReg.show();
  } else if (display === 'GRID') {
    $sort.closest(CONTAINER_SEL).hide();
    $cardsReg.hide();
    $reportReg.hide();

    hideLeftColumn();

    if (refresh) {
      $gridReg.trigger('apexrefresh');
    }

    $gridReg.show();
  }
}
  
function debounceSearch(e) {
    /*
     * Prevent search for following keys:
     * TAB:     9
     * SHIFT:   16
     * LEFT:    37
     * RIGHT:   39
     */
    if ( e.which === 9 || e.which === 16 || e.which === 37 || e.which === 39 ) {
        return false;
    }
    clearTimeout(timeout);
    timeout = setTimeout(applyFilters, 250);
}

function preventSubmitOnEnter(e) {
  if (e.which === 13) {
    return false;
  }
}

function resetFilters() {
  $search.val(null);
  $territory.val(null);
  $account.val(null);
  $show.val(null);
  $quarter.val(null);
  
  $sort.val('NAME');
  
  applyFilters();
}

// standard search event bindings
$search.keydown(preventSubmitOnEnter);
$search.keyup(debounceSearch);

// dynamic event bindings (will vary by filter page)
$territory.change(applyFilters);
$account.change(applyFilters);
$show.change(applyFilters);
$quarter.change(applyFilters);

// standard display, sort, reset event bindings
$displayAs.change(toggleRegionDisplay);
$sort.change(applyFilters);
$reset.click(resetFilters);
  
toggleRegionDisplay(false);

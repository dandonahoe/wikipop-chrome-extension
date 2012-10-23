var mouseX = 0;
var mouseY = 0;
var popupWidth = 400;
var popupCache = new Object();
var debugMode = false;

$(document).ready(function()
{
    if(window.Event)
        window.captureEvents(Event.MOUSEMOVE);

    document.onmousemove = function(e)
    {
        mouseX = (window.Event) ? e.pageX : event.clientX + document.body.scrollLeft;
        mouseY = (window.Event) ? e.pageY : event.clientY + document.body.scrollTop;
	};
	
	var hiddenData = 
	    '    <div id="wikipop-definition-popup" style="background-color:#FFFDCF;padding:10px;box-shadow: 4px 2px 20px rgba(0, 0, 0, 0.22);width:' + popupWidth + 'px;border-radius:10px;border:1px solid #000000;position:absolute;display:none;text-alignLleft;">' + 
	    '        <div id="wikipop-definition-popup-title" style="font-weight:bold;">' +
        '        </div>' +
	    '        <div id="wikipop-definition-popup-body">' +
        '        </div>' +
	    '    </div>';
	    
	$('body').append(hiddenData);
});

$('.mw-content-ltr').find("a").each(function(index)
{
    var originalRef = $(this).attr('href');
    var linkTitle   = $(this).attr('title');
    
    $(this).attr('title', '');
    
    if(originalRef.indexOf('/wiki/') == -1)
        return;
            
    $(this).css('border-bottom', '1px dotted #6E9DBF');
    
	$(this).hoverIntent(function(e)
	{
        if(popupCache[originalRef] == undefined)
        {
            popupCache[originalRef] = new Object();
            popupCache[originalRef].OriginalUrl         = originalRef
            popupCache[originalRef].FormattedSearchTerm = originalRef.replace('/wiki/', '');
            popupCache[originalRef].LinkTitle           = linkTitle;            
        }
 
        var definitionData = popupCache[originalRef];
        
        if(definitionData.Definition == undefined)
        {
		    $.ajax(
		    {
			    type: "GET",
			    url: "http://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=xml&search=" + popupCache[originalRef].FormattedSearchTerm,
			    dataType: "xml",
			    success: function(xml)
			    {
			        definitionData.Definition = $(xml).find("Description").text();
			        successfulLookup(definitionData);
			    }
		    });
		}
		else
		{
            successfulLookup(definitionData);
        }
        
		return false;
	},
	
	function(e)
	{
        $('#wikipop-definition-popup').fadeOut();
	});
 });
 
function successfulLookup(definitionData)
{
    var popupHeader = '';
    var debugFooter = '';
	
    popupHeader = definitionData.LinkTitle;

    if(debugMode)
    {
        debugFooter += '<br />DEBUG:';
        debugFooter += '<br /><b>OriginalUrl</b>: '         + definitionData.OriginalUrl;
        debugFooter += '<br /><b>FormattedSearchTerm</b>: ' + definitionData.FormattedSearchTerm;
        debugFooter += '<br /><b>LinkTitle</b>: '           + definitionData.LinkTitle;
    }
	
    $('#wikipop-definition-popup').css('left', (mouseX - popupWidth / 2) + 'px');
    $('#wikipop-definition-popup').css('top',  (mouseY + 24) + 'px');
    $('#wikipop-definition-popup-title').html(popupHeader);
    $('#wikipop-definition-popup-body').html(definitionData.Definition + debugFooter);
    $('#wikipop-definition-popup').fadeIn();
}
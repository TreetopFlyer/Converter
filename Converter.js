var Converter = {};
Converter.Utility = {};
Converter.Utility.Splitter = function(inString, inSplitter, inSesitivityRoutine)
{
    var i;
    var output = {};
    var segments = inString.split(inSplitter);
    for (i = 0; i < segments.length; i++) {
        var kvp = segments[i].split("=");
        var key = kvp[0];
		var value = "true";
		if(key != "")
		{
			if (kvp.length == 2)
			{
				value = decodeURIComponent(kvp[1]);
			}
			inSesitivityRoutine(output, key, value);
		}
    }
    return output;
};
Converter.Utility.CaseSesitive = function(inObject, inKey, inValue)
{
	inObject[inKey] = inValue;
};
Converter.Utility.CaseInsesitive = function(inObject, inKey, inValue)
{
	Converter.Utility.CaseSesitive(inObject, inKey.toLowerCase(), inValue.toLowerCase());
};

Converter.Config = {};
Converter.Config.Hours = 1;
Converter.Config.Case = Converter.Utility.CaseInsesitive;

Converter.QueryToObject = function (inString)
{
    if(arguments.length == 0)
    {
        inString = window.location.search;
    }
	
	if(inString[0] == "?")
		inString = inString.substring(1);

	return Converter.Utility.Splitter(inString, "&", Converter.Config.Case);
};
Converter.ObjectToQuery = function (inObj, inSet)
{
    var output = "";
    var property;
    var value;
    for (property in inObj) {
        value = inObj[property];
        if (value !== null)
            output += "&" + property + "=" + encodeURIComponent(value);
    }
	output = "?" + output.substring(1);
	
	if(output.length == 1)
		output = "";
	
	if(inSet)
	{
	    window.location.search = output;
	}
	return output;
};
Converter.CookieToObject = function (inString)
{
    if(arguments.length == 0)
    {
        inString = document.cookie;
    }
	return Converter.Utility.Splitter(inString, "; ", Converter.Config.Case);
};
Converter.ObjectToCookie = function (inObj, inSet)
{
    var property;
    var value;
    var hours;
	var output = "";

    var d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    for (property in inObj)
	{
        value = inObj[property];
        if (value != null)
            output += (property + "=" + value + ";path=/;expires=" + d.toGMTString());
        else
            output += (property + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT");
    }
    
    if(inSet)
    {
        document.cookie = output;
    }
	return output;
};
Converter.PathToObject = function(inPath)
{
    if(arguments.length == 0)
    {
        inPath = window.location.pathname;
    }
    
	var i;
	var count = 0;
	var current = false;
	var obj = {};
	var parts = window.location.pathname.split("/");
	
	for(i=0; i<parts.length; i++)
	{
		current = parts[i];
		if(current != "")
		{
			obj[count] = current;
			count++;
		}
	}
	return obj;
};
Converter.ObjectToPath = function(inObj, inSet)
{
	var prop;
	var output = "";
	for(prop in inObj)
	{
		output += "/"+inObj[prop];
	}
	
	if(inSet)
	{
	    window.location.pathname = output;
	}
	return output;
};

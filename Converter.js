/*
	methods:

	QueryStringAsObject(); // return an object based on the Query String
	ObjectAsQueryString(inObject); // set the Query String based on "inObject" (will case a reload, and will remove pruned values)
	
	CookieAsObject(); // return an object based on the Cookies
	ObjectAsCookie(inObject, inHours=1); // set the Cookies based on "inObject" (will remove pruned cookies. all remaining cookies will be reset with a duration of "inHours" [inHours defaults to 1 of not provided])

	examples:
	
	// Add/change Query String value:
	var object = Converter.QueryStringAsObject();
	object.NewProperty = "New Value";
	Converter.ObjectAsQueryString(object);
	
	// Remove QueryString value:
	var object = Converter.QueryStringAsObject();
	object.OldProperty = null;
	Converter.ObjectAsQueryString(object);	
	
	// Add/change Cookie:
	var object = Converter.CookiesAsObject();
	object.NewCookieName = "New Cookie Value";
	Converter.ObjectAsCookies(object);
	
	// Remove Cookie(s):
	var object = Converter.CookiesAsObject();
	object.someoldcookie = null;
	Converter.ObjectAsCookies(object);	
	
*/

var Converter = {};
Converter.Utility = {};
Converter.Utility.Splitter = function(inString, inSplitter, inSesitivityRoutine)
{
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
	if(inString[0] == "?")
		inString = inString.substring(1);

	return Converter.Utility.Splitter(inString, "&", Converter.Config.Case);
};
Converter.ObjectToQuery = function (inObj)
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
		return "";
	else
		return output;
};
Converter.CookieToObject = function (inString)
{
	return Converter.Utility.Splitter(inString, "; ", Converter.Config.Case);
};
Converter.ObjectToCookie = function (inObj)
{
    var property;
    var value;
    var hours;
	var output = "";
    if (arguments.length == 2)
        hours = arguments[1];
    else
        hours = Converter.Config.Hours;

    var d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    for (property in inObj)
	{
        value = inObj[property];
        if (value !== null)
            document.cookie = (property + "=" + value + "; expires=" + d.toGMTString());
        else
            document.cookie = (property + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT");
    }
	return output;
};
Converter.SlashPathToObject = function(inPath)
{
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
Converter.ObjectToSlashPath = function(inObj)
{
	var i;
	var output = "";
	for(prop in inObj)
	{
		output += "/"+inObj[prop];
	}
	return output;
};

Converter.State = {};
Converter.State.Cookie = Converter.CookieToObject(document.cookie);
Converter.State.Query = Converter.QueryToObject(window.location.search);
Converter.State.SlashPath = Converter.SlashPathToObject(window.location.pathname);
Converter.State.Commit = function()
{
	Converter.ObjectToCookie(Converter.State.Cookie);
	window.location = window.location.origin + Converter.ObjectToSlashPath(Converter.State.SlashPath) + Converter.ObjectToQuery(Converter.State.Query);
};


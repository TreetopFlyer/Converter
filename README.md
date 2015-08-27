# Converter

Converter has the ability to convertert URL elements and the cookie string into JavaScript objects and vice-versa.
This allows you to manipulate these values in JavaScript with relative ease. 

`URL Query String <-----> object`  
`Cookies <--------------> object`  
`URL Path <-------------> indexed array`  

Converter has a property called **Converter.State** that is populated with the query string, cookies, and path values
so that the overall "state" of the current page now exists as editable JavaScript objects. When the page loads:  
* The URL query string is
converted into an object and stored at **Converter.State.Query**  
* The cookies are converted into an object and stored at **Converter.State.Cookie**  
* The path is converted into an indexed array and stored at **Converter.State.Path**  

Calling the method **Converter.State.Commit()** will cause the values stored in **Converter.State** to be pushed
back into their appropriate sources.

### Examples

If we are at the amazing *www.site.com/*, some site that has Converter.js and we execute:  
`Converter.State.Path.push("people");`  
`Converter.State.Query.person = "Seth";`  
`Converter.State.Commit();`  
We will be sent to *www.site.com/people?person=seth*.  

Once there, we can examine the query string with something like:  
`console.log(Converter.State.Query);`  
`\\outputs Object {person: "Seth"}`  

From here, we can continue to manipulate the query string with something like:  
`Converter.State.Query.person="ronald";`  
`Converter.State.Query.show_full_profile="true";`  
`Converter.State.Commit();`  
This will overwrite the value for the key "person" and add a new key "show_full_profile" with its value.
So the URL will change the URL to *www.site.com/people?person=ronald&show_full_profile=true*  
Obviously, you can also use the syntax:  
`Converter.State.Query["show_full_profile"]="true";` 

If we now want to *remove* "show_full_profile" from the query string, set it to `null` and call Converter.State.Commit():
`Converter.State.Query.show_full_profile = null;`  
`Converter.State.Commit();`  
This will change the URL to just *www.site.com/people?person=ronald*  
To remove the query string completely, you can set the Converter.State.Query to an empty object:  
`Converter.State.Query = {};`  
`Converter.State.Commit();`  

Let's set a cookie that indicates which people have been viewed and return to the home page:  
`Converter.State.Cookie.people_viewed = "seth,ronald";`  
`Converter.State.Path = [];`  
`Converter.State.Commit();`  
Because we wiped out the Path array by setting it to an empty one, this will return us to *www.site.com/*  

Back at the homepage, we can see the cookie we set earlier with:  
`console.log(Converter.State.Cookie.people_viewed);`  
`\\outputs: Object {people_viewed: "seth,ronald"};`  

We can delete this particular cookie by setting it to `null`, just like we did with the query string:
`Converter.State.Cookie.people_viewed = null;`  
`Converter.State.Commit();`  
Or we can assign an empty object to Converter.State.Cookie to remove all cookies. You know the drill.


Well, its been a wild ride. Thanks!

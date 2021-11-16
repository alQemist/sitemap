# NAVIGATIONAL SITE MAP
d3js Vertical Tree Layout for viewing navigational (web) site map

Solution is inspired by d3.js Vertical Tree example like this: https://bl.ocks.org/d3noob/8326869

Copyright alQemy 2021
ben@alQemy.com

GNU GENERAL PUBLIC LICENSE

FEATURES INCLUDE

Toggle button for light/dark styling
Filter data set based on date Import new JSON data to update the chart without uploading - your data remains local
Export the chart data to JSON file

##DATA MODEL

 - title_text = Title of the chart displayed vertically
 - style_option = boolean which sets the default display mode light vs dark
 - legend_keys = list of keys used for the chart color-coded legend
 - legend_key = data element used to designate what data element is to be be used as the key for color coding and the legend
 - timeline = array of dates
     - date = date of the data set
       - data = array of key/values
           - parent = from navigational point
           - name = to navigational point
           - type = type of view (optional)
           - description = details about the point
           - state = key used for color coding and legend
         
##Sample JSON
<pre>
<code>
{
"title_text": "Navigation Site Map",
"style_option": true,
"legend_keys": [
    "Design",
    "Development",
    "Test",
    "Complete"
],
"legend_key": "state",
"timeline": [
    {
    "date": "2021-11-01",
    "data": [
        {
        "parent": "",
        "name": "Login",
        "type": "form",
        "description": "entry into the website",
        "state": "3"
        }]
    }]
}
</code></pre>

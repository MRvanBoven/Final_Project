## Style Rules as Drafted by Team J

### General
*  Be consistent!
*  Uphold the maximum of 80 characters per line of code.
*  Add a (multi line) comment atop every function, briefly explaining the purpose of the function.
*  Add a header comment atop the programme, with at least the programmer's name and student number, and a brief description of the functionality of the programme.
*  Write all code in functions, except for occasional global variables.
*  Use spaces around all mathematical signs, e.g.
```
let i = 3 + 4;
```


### JavaScript
*  Put semicolons after basically every expression that doesn't end in an accolade.
*  Use camelCase notation.
*  Always use `let`, `var` or `const` when defining a variable. Be consistent in the choice between the three options.


### D3
*  Use a new line for every added method, and keep the dots preceding these on the same indentation level. For example:
```
let svg = d3.select("body")
            .append("svg")
            .attr("class", "slider")
            .attr("width", w)
            .attr("height", h);
```

### CSS
*  Define static styles in CSS.

## Personal Style Preferences

# D3
*  For indentation when using functions inside D3 methods, I chose to indent everything inside the function four spaces from the dot, and to place the ending accolade on a new line, one place right from the dotline. Example:
```
dots.attr("cx", function(d) {
         return xScale(d[1]);
     })
    .attr("cy", function(d) {
         return yScale(d[2]);
     })
    .attr("r", 10)
    .style("fill", function(d) {
         return counColors[d[0]];
     });
```

## Online Style Guides
* [JavaScript](https://github.com/airbnb/javascript)
* [D3](https://northlandia.wordpress.com/2014/10/23/ten-best-practices-for-coding-with-d3/)

# FancyMenus
So, If you need "menus" in where you can add elements with text, description and an icon, and also add a placeholder with everything already said, this is the right place.

## Getting started:

1. First of all you need to create a container element, in where your menu is going to be.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <div id="menu-container"></div>
</body>
</html>
```

2. Then you have to import the script and the CSS from the `/dist` folder. In this case I recommend using **jsdelivr**.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.css">
    <script defer src="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.js"></script>
</head>
<body>
    <div id="menu-container"></div>
</body>
</html>
```

3. After this, you can create an instance of the class `FancyMenu`, specifying a container element to start.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.css">
    <script defer src="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.js"></script>
</head>
<body>
    <div id="menu-container"></div>
    <script>
        const menu = new FancyMenu(document.getElementById("menu-container"));
    </script>
</body>
</html>
```

4. That's it! Now you can start adding options and more to your menu!
```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.css">
    <script defer src="https://cdn.jsdelivr.net/gh/c4rlux/fancy-menus@main/dist/fancy-menus.js"></script>
</head>
<body>
    <div id="menu-container"></div>
    <script>

        const menu = new FancyMenu(document.getElementById("menu-container"));

        // Adding a placeholder with a name, description, image and icon
        menu.setPlaceholder({
            name: "Select here...",
            description: "You can select elements from here!",
            image: "https://twemoji.maxcdn.com/v/14.0.2/72x72/2705.png",
            icon: "./down-icon.svg"
        })

        // Setting items with a name, description and image
        menu.setItems(
            new Array(10).fill("").map((_, index) => {
                return {
                    name: `Option ${index + 1}`,
                    description: "This is a clickable option",
                    image: "https://twemoji.maxcdn.com/v/14.0.2/72x72/1f449.png"
                };
            })
        )

        // Update the changes to the menu
        menu.refresh();

        // Setting a function to log a message when a user selects an option
        menu.onSelectOption = (element, index) => {
            console.log(`You clicked on the option ${index + 1}`);
        }

    </script>
</body>
</html>
```

Note: All the object properties but `name` in the `setItems`, `addItems` and `setPlaceholder` are optional.
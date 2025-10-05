# 🌌 Astroview

This project is a submission for the [**NASA 2025 Space Apps Challenge**](https://www.spaceappschallenge.org/2025/). Made by team **ImageInators**.

✨ **ASTROVIEW** is a hub for **anyone** to explore and view splendid images of Space, Earth and Planets captured by satellites from [NASA](https://nasa.gov) and other Space Agencies. It can view images in **full resolution**, **zoom and pan** to **discover new patterns** and features, **annotate with pens and shapes of various thicknesses and colors** with just a click. A simple and intuitive experience to experience the marvelous universe we live in, simply from our browser. 🌐

![Screenshot of the annotation features](screenshot1.png)
![Screenshot of the landing page](screenshot2.png)

🖼️Our project takes **high resolution images** from datasets by **NASA** or other Space Agencies, which is converted to a DeepZoom([.dzi](https://en.wikipedia.org/wiki/Deep_Zoom)) file format which contains thousands of smaller images, so that it can be viewed smoothly in lower-end devices and even embedded in browsers. Then, we annotate on top of the image using [**p5.js**](https://p5js.org/), a library of JavaScript used for simulation and creative coding. We host all these features on a web app made with **JavaScript, CSS and HTML**. We also used tools like [**Figma**](https://en.wikipedia.org/wiki/Figma) and [**Freeform**](https://apps.apple.com/us/app/freeform/id6443742539) to design and plan the features for our project.

## Stack used

- HTML
- CSS
- JavaScript
- [OpenSeadragon](https://openseadragon.github.io/)
- [libvips](https://github.com/libvips/libvips) 
- Figma

## How to run

1. First, clone the repository
```bash
git clone https://github.com/pranavcl/astroview
```

2. Start a web server in the root of the cloned directory using something like Python:
```bash
cd astroview
python -m http.server 3000
```
3. Open your web browser at the port (https://localhost:3000)

4. To add new images, you must download [vips](https://github.com/libvips/libvips) first. Add the .jpeg image to the `./dzi_images` directory and convert it to the DZI file format using the following command:

```bash
vips dzsave jpeg_image_name.jpg dzi_image
```

5. Open the new image in the viewer by going to `https://localhost:3000?img=dzi_image`

## Attributions

All the icon images were taken from Flaticon:
1. [Pointer icon by Pixel perfect](https://www.flaticon.com/free-icon/cursor_1828166?term=pointer&page=1&position=7&origin=search&related_id=1828166)
2. [Pen icon by Kiranshastry](https://www.flaticon.com/free-icon/pen_1159725?term=pen&page=1&position=14&origin=search&related_id=1159725)
3. [Eraser icon by Iconjam](https://www.flaticon.com/free-icon/eraser_4043845?term=eraser&page=1&position=1&origin=search&related_id=4043845)
4. [Text icon by IconKanan](https://www.flaticon.com/free-icon/text_3856192?term=text&page=1&position=14&origin=search&related_id=3856192)
5. [Line icon by Dreamstale](https://www.flaticon.com/free-icon/nodes_517058?term=line&page=1&position=22&origin=search&related_id=517058)
6. [Rectangle icon by Freepik](https://www.flaticon.com/free-icon/rectangle_3305372?term=rectangle&page=1&position=5&origin=search&related_id=3305372)
7. [Move text icon by Andrean Prabowo](https://www.flaticon.com/free-icon/move_3771730?term=move&page=1&position=3&origin=search&related_id=3771730)
8. [Share icon by Freepik](https://www.flaticon.com/free-icon/share_1358023?term=share&page=1&position=1&origin=search&related_id=1358023)
9. [Back icon by Kirill Kazachek](https://www.flaticon.com/free-icon/arrow_507257?term=back&page=1&position=4&origin=search&related_id=507257)
10. [Zoom-in icon by Freepik](https://www.flaticon.com/free-icon/zoom-in_545651?term=zoom+in&page=1&position=1&origin=search&related_id=545651)
11. [Zoom-out icon by Freepik](https://www.flaticon.com/free-icon/magnifying-glass_74158?term=zoom+in&page=1&position=2&origin=search&related_id=74158)
12. [Rotate icon by revolutionizzed_1](https://www.flaticon.com/free-icon/rotate_15440060?term=reset&page=1&position=20&origin=search&related_id=15440060)

### Fonts used

1. Arial
2. Space Mono
3. Instrumental Sans

### Image links

1. [Messier31 Image](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/#:~:text=In%20January%20of%202025%2C%20NASA&#x27;s,were%20challenging%20to%20stitch%20together.)
2. [NIRCam Image of the "Cosmic Cliffs" in Carina](https://esawebb.org/images/weic2205a/)
3. [Hubble and Webb Showcase the Pillars of Creation (Side by Side)](https://esawebb.org/images/weic2216d/)
4. [Whirlpool Galaxy M51](https://www.esa.int/ESA_Multimedia/Images/2005/04/Whirlpool_Galaxy_M51)


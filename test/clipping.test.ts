import {expect, describe, beforeEach, it} from "vitest"

import * as pureimage from "../src/index.js"
import {write_png} from "./common";

describe('clipping tests',() => {
    let image: pureimage.Bitmap;
    let context: pureimage.Context;

    beforeEach(() => {
        image = pureimage.make(200, 200)
        context = image.getContext('2d')
    })

    it('canvas is empty and clear', () => {
        expect(image.getPixelRGBA(0, 0)).to.eq(0x00000000)
    })

    it('can fill with white and red', async () => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 200, 200);
        context.beginPath();
        context.arc(100, 100, 50, 0, Math.PI * 2, false)
        context.clip();
        context.fillStyle = 'red';
        context.fillRect(0, 0, 200, 200);
        await write_png(image, 'clipcolor')
        console.log("wrote out clipcolor.png")
        expect(image.getPixelRGBA(0, 0)).to.eq(0xFFFFFFFF)
        expect(image.getPixelRGBA(100, 100)).to.eq(0xFF0000FF)
    })

    it('can draw an image inside of a clip',async ()=>{
        context.fillStyle = 'red';
        context.fillRect(0, 0, 200, 200);
        context.beginPath();
        context.arc(100,100, 10, 0, Math.PI*2,false)
        context.clip();
        context.fillStyle = 'white';
        context.fillRect(0, 0, 200, 200);
        let src = pureimage.make(50,50)
        const c = src.getContext('2d')
        c.fillStyle = 'white'
        c.fillRect(0,0,50,50)
        c.fillStyle = 'black'
        c.fillRect(25,0,25,50)
        context.drawImage(src,75,75,50,50)
        await write_png(image,'clipimage')
        expect(image.getPixelRGBA(0, 0)).to.eq(0xFF0000FF)
        expect(image.getPixelRGBA(99, 100)).to.eq(0xFFFFFFFF)
        expect(image.getPixelRGBA(80, 100)).to.eq(0xFF0000FF)
    })


})

import { _decorator, Component, Node, rendering,  Material, renderer, Vec4, gfx, input, postProcess } from 'cc';
const { ccclass, property, menu } = _decorator;

const { SettingPass, PostProcessSetting, BlitScreenPass,ForwardPass, }=postProcess

@ccclass('CustomPostProcess')
@menu('PostProcess/CustomPostProcess')
export class CustomPostProcess extends PostProcessSetting {
    @property
    blueIntensity = 1

    @property
    showDepth = false

    @property
    depthRange = 30

    @property(Material)
    _material: Material | undefined

    @property(Material)
    get material () {
        return this._material;
    }
    set material (v) {
        this._material = v;
    }
}


export class CustomPass extends SettingPass {
    // custom pass name
    name = 'CustomPass'

    // out out slot name
    outputNames: string[] = ['CustomPassColor']

    // reference to post process setting
    get setting () { return this.getSetting(CustomPostProcess); }

    // Whether the pass should rendered
    checkEnable(camera: renderer.scene.Camera): boolean {
        let setting = this.setting;
        return setting && setting.material && super.checkEnable(camera);
    }

    params = new Vec4

    render (camera: renderer.scene.Camera, ppl: rendering.Pipeline) {
        const cameraID = this.getCameraUniqueID(camera);

        // clear background to black color 
        let context = this.context;
        context.clearBlack()

        // input name from last pass's output slot 0
        let input0 = this.lastPass.slotName(camera, 0);
        // output slot 0 name 
        let output = this.slotName(camera, 0);

        // get depth slot name
        let depth = context.depthSlotName;

        // also can get depth slot name from forward pass.
        // let forwardPass = builder.getPass(ForwardPass);
        // depth = forwardPass.slotName(camera, 1);

        // set setting value to material
        let setting = this.setting;
        this.params.x = setting.blueIntensity
        this.params.y = setting.showDepth ? 1 : 0;
        this.params.z = setting.depthRange;
        setting.material.setProperty('params', this.params);

        context.material = setting.material;
        context
            // update view port
            .updatePassViewPort()
            // add a render pass
            .addRenderPass('post-process', `${this.name}${cameraID}`)
            // set inputs
            .setPassInput(input0, 'inputTexture')
            .setPassInput(depth, 'depthTexture')
            // set outputs
            .addRasterView(output, gfx.Format.RGBA8)
            // blit
            .blitScreen(0)
            .version();
    }
}

let builder = rendering.getCustomPipeline('Custom') as postProcess.PostProcessBuilder;
if (builder) {
    builder.insertPass(new CustomPass, BlitScreenPass);
}

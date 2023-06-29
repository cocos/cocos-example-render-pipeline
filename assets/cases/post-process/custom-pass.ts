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
    name = 'CustomPass'
    outputNames: string[] = ['CustomPassColor']

    get setting () { return this.getSetting(CustomPostProcess); }

    checkEnable(camera: renderer.scene.Camera): boolean {
        let setting = this.setting;
        return setting.material && super.checkEnable(camera);
    }

    params = new Vec4

    render (camera: renderer.scene.Camera, ppl: rendering.Pipeline) {
        const cameraID = this.getCameraUniqueID(camera);

        let context = this.context;
        context.clearBlack()

        let input0 = this.lastPass.slotName(camera, 0);
        let output = this.slotName(camera);

        let setting = this.setting;
        let forwardPass = builder.getPass(ForwardPass);
        let depth = forwardPass.slotName(camera, 1);

        this.params.x = setting.blueIntensity
        this.params.y = setting.showDepth ? 1 : 0;
        this.params.z = setting.depthRange;
        setting.material.setProperty('params', this.params);

        // if (setting.showDepth) {
        //     input0 = depth;
        // }

        context.material = setting.material;
        context
            .updatePassViewPort()
            .addRenderPass('post-process', `${this.name}${cameraID}`)
            .setPassInput(input0, 'inputTexture')
            .setPassInput(depth, 'depthTexture')
            .addRasterView(output, gfx.Format.RGBA8)
            .blitScreen(0)
            .version();
    }
}

let builder = rendering.getCustomPipeline('Custom') as postProcess.PostProcessBuilder;
if (builder) {
    builder.insertPass(new CustomPass, BlitScreenPass);
}

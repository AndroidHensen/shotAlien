
import { _decorator, Component, Node, view, tween, Vec3, UITransform, SystemEvent, EventTouch, director, PhysicsSystem, ParticleSystem, Sprite, EPhysics2DDrawFlags, PhysicsSystem2D, IPhysics2DContact, ParticleSystem2D, Contact2DType, macro, Collider2D, Tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Fri Jul 29 2022 17:22:00 GMT+0800 (中国标准时间)
 * Author = 我爱喜洋洋
 * FileBasename = game.ts
 * FileBasenameNoExtension = game
 * URL = db://assets/game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Game')
export class Game extends Component {

    @property(Node)
    player: Node = null;

    @property(Node)
    boom: Node = null;

    @property(Node)
    enmey: Node = null;

    fire = null
    down = null

    enmeyMoveLeft = false
    enmeyDie = false

    start() {
        this._initPlayer()
        this._initEnemy()

        this.node.on(SystemEvent.EventType.TOUCH_START, this._touchStart, this);
    }

    update(deltaTime: number) {
        this._moveEnmey()
        this._enmeyDie()
    }

    _enmeyDie() {
        if (this.enmeyDie) {
            this.player.active = false
            this.enmey.active = false
            this._restart()
        }
    }

    _moveEnmey() {
        let speed = 8
        let pos = this.enmey.getPosition()
        let destX = 0

        if (this.enmeyMoveLeft) {
            destX = pos.x - speed
        } else {
            destX = pos.x + speed
        }

        if (destX > view.getVisibleSize().width / 2) {
            this.enmeyMoveLeft = true
        } else if (destX < -view.getVisibleSize().width / 2) {
            this.enmeyMoveLeft = false
        }

        if (this.enmeyMoveLeft) {
            this.enmey.setPosition(destX, pos.y)
        } else {
            this.enmey.setPosition(destX, pos.y)
        }
    }

    _touchStart(touch: Touch, event: EventTouch) {
        this._fire()
    }

    _initPlayer() {
        this.player.setPosition(0, -view.getVisibleSize().height / 4)

        this.down = tween()
            .target(this.player)
            .to(5, { position: new Vec3(0, -view.getVisibleSize().height / 2 + this.player.getComponent(UITransform).height / 2) })
            .call(() => {
                this._die()
            })
            .start()
    }

    _initEnemy() {
        this.enmey.setPosition(0, view.getVisibleSize().height / 4)
        let collider = this.enmey.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.fire.stop()
        this.down.stop()
        this._boom(this.enmey.getPosition(), this.enmey.getComponent(Sprite).color)
        this.enmeyDie = true
    }

    _fire() {
        this.fire = tween()
            .target(this.player)
            .to(0.2, { position: new Vec3(0, view.getVisibleSize().height / 2 - this.player.getComponent(UITransform).height / 2) })
            .call(() => {
                this._die()
            })
            .start()
    }

    _die() {
        this.player.active = false
        this._boom(this.player.getPosition(), this.player.getComponentInChildren(Sprite).color)
        this.down.stop()
        this._restart()
    }

    _restart() {
        this.scheduleOnce(function () {
            director.loadScene("game.scene")
        }, 0.7);
    }

    _boom(pos, color) {
        let ps: ParticleSystem2D = this.boom.getComponent(ParticleSystem2D)
        this.boom.setPosition(pos)
        if (color != undefined) {
            ps.startColor = ps.endColor = color
        }
        ps.resetSystem()
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */

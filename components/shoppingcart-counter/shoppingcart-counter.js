// components/counter/counter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maxNumber: null,
    num: null
  },
  attached() {
    console.log(this, "this");
    let {
      num
    } = this.data;
    this.setData({
      number: num
    });
  },
  /**
   * 组件的初始数据
   */
  data: {
    number: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reduce() {
      this.setData({
        number: this.data.number -= 1
      }, function () {
        let number = this.data.number;
        this.triggerEvent('changeNumber', number);
      });
    },
    plus() {
      this.setData({
        number: this.data.number += 1
      }, function () {
        let number = this.data.number;
        this.triggerEvent('changeNumber', number);
      });
    }
  }
})
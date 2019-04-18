
class Url {
    hostname = {
        tests: '//192.168.0.56:3200',
        test: '//mallapitest.emake.cn',
        development: '//git.emake.cn:3100',
        production: '//mallapi.emake.cn',
        mqttdev: 'git.emake.cn',
        mqtttest: 'mallapitest.emake.cn',
        mqttpro: 'api.emake.cn',
        lookdev: '//git.emake.cn:5000',
        looktest: '//mallapitest.emake.cn:5100',
        lookpro: '//www.emake.cn:5100',
        // catetest: ['001-002', '002-001'],
        catetest: ['001', '002'],
        catepro: ['001', '002'],
        goodsUrldev: '//192.168.0.60:3000',
        goodsUrltest: 'webtest.emake.cn/mallGoodsDetail',
        goodsUrlprod: 'web.emake.cn/mallGoodsDetail',
    };
    // mqttUrl = this.hostname.mqttpro;
    // lookUrl = this.hostname.lookdev;
    // cateUrl = this.hostname.catetest;
    // baseUrl = this.hostname.development;
    // goodsUrl = this.hostname.goodsUrldev

    mqttUrl = this.hostname.mqtttest;
    lookUrl = this.hostname.looktest;
    cateUrl = this.hostname.catetest;
    baseUrl = this.hostname.test;
    goodsUrl = this.hostname.goodsUrltest;

    // mqttUrl = this.hostname.mqttpro;
    // lookUrl = this.hostname.lookpro;
    // cateUrl = this.hostname.catepro;
    // baseUrl = this.hostname.production;
    // goodsUrl = this.hostname.goodsUrlprod;
}
export default new Url();
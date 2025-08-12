/**
 * @param {number[]} derived
 * @return {boolean}
 */
/**
 * 
考虑的场景
1. 数据完整性 在传输或存储大量数据包时，为了判断是否出现错误，常用XOR 校验来快速验证数据是否被破坏。
2. 一些物联网或分布式系统中，节点以环形方式连接；
3. 在图像的像素行或列中嵌入一组二进制水印值；
4. 某些嵌入式系统（如 RFID 标签或 IoT 芯片）使用 XOR 方式压缩并存储配置；
5. 秘密共享 / 密钥分发系统中的验证
 */
var doesValidArrayExist = function(derived) {
      return derived.reduce((acc, val) => acc ^ val, 0) === 0;
};
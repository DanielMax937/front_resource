1. 计算 MemberExpression。 MemberExpression就是()前面的部分
2. 基值（base value）就是 MemberExpression的左边部分
3. 如果 base value 是对象，this 就是该对象；如果是环境记录，this 就是 undefined。
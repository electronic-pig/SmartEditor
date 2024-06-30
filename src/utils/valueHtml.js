// valueHtml.js
const valueHtml = `<h1>一、编辑器介绍</h1>
<h2>1.1 文字类</h2>
<h3>文字</h3><p>默认<span style="font-family: 宋体"> 宋体 </span><span style="font-family: 黑体">黑体 </span><span style="font-family: 楷体">楷体 </span><span style="font-family: Arial">Arial  </span><span style="font-family: Comic\ Sans\ MS">Comic Sans MS </span><span style="font-family: Times\ New\ Roman">Times New Roman</span></p><p><strong><span style="font-family: Times\ New\ Roman">粗体</span></strong><em><span style="font-family: Times\ New\ Roman">  斜体</span></em><span style="font-family: Times\ New\ Roman">   </span><strong><em><span style="font-family: Times\ New\ Roman">粗斜体 </span></em></strong></p><h3>标记</h3><p><strong><em><span style="font-family: Times\ New\ Roman"> </span></em></strong><u><span style="font-family: Times\ New\ Roman">下划线</span></u><span style="font-family: Times\ New\ Roman">     </span><s><span style="font-family: Times\ New\ Roman">删除线</span></s><span style="font-family: Times\ New\ Roman">     </span><span style="color: #f44336; font-family: Times\ New\ Roman">红色</span><span style="font-family: Times\ New\ Roman">    </span><span style="color: #2196f3; font-family: Times\ New\ Roman">蓝色</span><span style="font-family: Times\ New\ Roman">     </span><span style="color: #4caf50; font-family: Times\ New\ Roman">绿色   </span><span style="color: #999999; font-family: Times\ New\ Roman">灰色</span></p>

<p>这是一段文本，其中包含了<mark>文本高亮 </mark>，一段行内代码<code>print(hello world!)</code>，包含了上标e<sup>x</sup> 和下标x<sub>0</sub>，以及包含了一个<a target="_blank" rel="noopener noreferrer nofollow" href="https://www.baidu.com/">百度</a>的链接，同时下面存在一条分隔线，最后是一个emoji表情🤓</p><hr>

<h3>无序列表</h3>
<ul>
  <li>列表项</li>
  <li>列表项</li>
  <li>列表项</li>
</ul>
<h3>有序列表</h3>
<ol>
  <li>列表项 1</li>
  <li>列表项 2</li>
  <li>列表项 3</li>
</ol>
<h3>任务列表</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">任务一</li>
  <li data-type="taskItem" data-checked="false">任务二</li>
</ul>
<h3>对齐</h3><p>左对齐</p><p style="text-align: center">居中对齐</p><p style="text-align: right">右对齐</p>

<h2>1.2 其他类</h2>
<h3>代码</h3>
<p><code>This is code.</code></p>

<pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}
</code></pre>
<h3>引用</h3>
<blockquote>
  <p>To be, or not to be, that is the question.</p>
    <p>———— WILLIAM SHAKESPEARE.</p>
</blockquote>
<h3>图片</h3>
<img src="https://placehold.co/800x600" alt="img"/>
<h3>表格</h3>
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <th colspan="3">Description</th>
    </tr>
    <tr>
      <td>Cyndi Lauper</td>
      <td>Singer</td>
      <td>Songwriter</td>
      <td>Actress</td>
    </tr>
  </tbody>
</table>
<vue-component>
  <p>This is editable.</p>
</vue-component>
`;

export default valueHtml
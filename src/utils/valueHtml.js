// valueHtml.js
const valueHtml = `<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>文本类</h3>

<p>The Paragraph extension is not required, but it’s very likely you want to use it. It’s needed to write paragraphs of text. 🤓</p>

<h3>列表类</h3>
<ul>
  <li>This is a bullet list.</li>
  <li>And it has three list items.</li>
  <li>Here is the third one.</li>
</ul>

<ol>
  <li>That’s a different list, actually it’s an ordered list.</li>
  <li>It also has three list items.</li>
  <li>And all of them are numbered.</li>
</ol>

<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">A list item</li>
  <li data-type="taskItem" data-checked="false">And another one</li>
</ul>

<h2>二级标题</h2>
<h3>代码类</h3>
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
<h3>其他类</h3>
<blockquote>
  <p>This is a blockquote.</p>
</blockquote>
<p>This is a basic example of implementing images. Drag to re-order.</p>
<img src="https://placehold.co/800x400" />
<img src="https://placehold.co/800x400/6A00F5/white" />
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
`;

export default valueHtml
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {resolveStreams} from './resolve-streams.mjs';
test('streamed content replaces its loading fallback before the footer',()=>{
 const $=load('<main><!--$?--><template id="B:0"></template><p>Loading</p><!--/$--></main><footer>Footer</footer><div hidden id="S:0"><h1>Article</h1><p>Full content</p></div>');
 assert.equal(resolveStreams($),1);
 assert.equal($('main h1').text(),'Article');
 assert.equal($('main p').text(),'Full content');
 assert.equal($('[id="S:0"]').length,0);
 assert.equal($('footer').text(),'Footer');
 assert.equal(resolveStreams($),0);
});
test('nested boundaries are resolved without deleting following content',()=>{
 const $=load('<main><!--$?--><template id="B:0"></template><p>Loading</p><!--/$--><p id="after">After</p></main><div hidden id="S:1"><strong>Nested</strong></div><div hidden id="S:0"><h1>Article</h1><!--$?--><template id="B:1"></template><i>Wait</i><!--/$--></div>');
 assert.equal(resolveStreams($),2);
 assert.equal($('main strong').text(),'Nested');
 assert.equal($('#after').text(),'After');
 assert.equal($('main i').length,0);
});

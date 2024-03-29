import React, { useEffect, useState } from 'react'
import Navbar from '../../component/Navbar/Navbar'
import "./Single.scss"
import { Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import attrs from "markdown-it-attrs";
import ToTop from '../../component/ToTop.jsx/ToTop';
import katex from 'markdown-it-katex';


function Single() {
  const [post,setPost] = useState({title:"",date:"",content:"",cat:""});
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const res = await axios.get(`/api/article/${id}`);
        setPost(res.data[0]);
        
      } catch(error){
        console.log(error);
      }
      
    }
    fetchData();
  },[id])
    

  const [btn,setBtn]=useState(false);
  useEffect(()=>{
    const handleScroll = ()=>{
      const scrollUp = document.documentElement.scrollTop;
      if(scrollUp > 500){
        setBtn(true);
      }else{
        setBtn(false);
      }
    }
    window.addEventListener("scroll",handleScroll);
    return ()=>{
      window.removeEventListener("scroll",handleScroll);
    }
  })

  const md=new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ''; // 使用默认的Markdown转义
    },
    html: true, // 允许渲染原始 HTML
    xhtmlOut: false, // 不生成 XHTML 格式的输出
    breaks: true, // 自动识别换行符
  });
  md.use(attrs);
  md.use(katex);

// 扩展渲染规则
  md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    // 获取引用层级（根据引用层级来设置左边框的样式）
    const level = token.attrGet('level') || 0;
    const paddingLeft = level * 10+30 +"px" ; // 根据层级计算 padding-left 的值

    return `<blockquote class="custom-blockquote" style="padding: 10px 30px 10px ${paddingLeft}; ">`;
  };

  const result=md.render(`${post.content?.replace(/''/g, "'")
  .replace(/""/g, '"')
  .replace(/\\\\/g, '\\')}`);

  return (
    <>
    <Navbar />
    {btn&&<ToTop />}
      <div className='single-main'>
          <div className='center'>
              <Link to="/passage">

                  <div className='back'>返回</div>

              </Link>
              <div className='passage'>
                <h1 className='title'>{post.title}</h1>
                <div className='content' dangerouslySetInnerHTML={{__html: result}}></div>
                {/* <div className='content'>{post.content}</div> */}
              </div>
              <div className='time'>{post.date}</div>
              
          </div>
      </div>
      </>
  )
}

export default Single
/*=======================================================================
 import
=======================================================================*/
import React, { Component } from "react";
import EventListener from 'react-event-listener';
import df from '../config/define';
import socketIOClient from "socket.io-client";

/*=======================================================================
 class
=======================================================================*/
class ViewChat extends Component {
    /**
     * @description コンストラクター
     * @param {} props | ?
     * @returns ×
     */
    constructor(props) {
        super(props);
        this.state = {
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
            TABLE_SIZE_WIDTH: 0,
            TABLE_SIZE_HEIGHT: 0,
            TAG_NUM: 0,
            TAG_SIZE: 0,
            TR_NUM: 0,
            TD_NUM: 0,
            TOTAL_TD: 0,
            TAG_RANDUM_ARR: [],
            TRIVIA: [],
            FONT_SIZE: 10,
            p_lang_color: [],
        };
    }

    /*=======================================================================
     life cycle
    =======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
        this.calculateTable();
    }

    componentDidMount() {
        let socket = this.state.socket;

        let total_td = this.state.TOTAL_TD;

        // 豆知識送信時
        socket.on("emit_from_server_trivia", (data) => {

            let p_lang_name = data.p_lang_name;
            let p_lang_color_code = data.p_lang_color;
            let trivia_id = data.trivia_id;
            let article = data.article;

            let tag_size = this.state.TAG_SIZE;

            let trivia_tags = document.querySelectorAll('.trivia-tag');
            let delete_trivia_tag_id = 0;
            let tag_ids = [];

            // 全tag-idを取得して数字部分のみを配列に
            for (let trivia_tag of trivia_tags) {
                // tag_id取得
                let tag_classes = trivia_tag.className;
                let ary_tag_classes = tag_classes.split(' ');
                let tag_id = ary_tag_classes[1];
                // 数字だけ抽出
                tag_id = tag_id.replace(/[^0-9]/g, '');
                tag_ids.push(tag_id);
            }
            // 表示されてる中で一番小さい（古い）tag_idを取得
            for (let tag_num of tag_ids) {
                if (delete_trivia_tag_id === 0) {
                    delete_trivia_tag_id = tag_num;
                } else if (delete_trivia_tag_id > tag_num) {
                    delete_trivia_tag_id = tag_num;
                }
            }

            let delete_trivia_tag = document.querySelector('.tag-id-' + delete_trivia_tag_id);
            let td_num = delete_trivia_tag.getAttribute('current-td-num');
            let parent_td = document.querySelector('.td-id-' + td_num);

            // タグ削除
            while (parent_td.firstChild) parent_td.removeChild(parent_td.firstChild);

            (async () => {
                try {
                    await this.sample1(trivia_id, td_num, p_lang_name, p_lang_color_code, parent_td);
                } catch (err) {
                    console.log(err);
                }
            })();

            (async () => {
                try {
                    await this.sample2(trivia_id, p_lang_name, article, tag_size);
                } catch (err) {
                    console.log(err);
                }
            })();

            // let div = document.createElement('div');
            // let span = document.createElement('span');

            // // タグを生成後、配置
            // div.classList.add('trivia-tag');
            // div.classList.add('tag-id-' + trivia_id);
            // div.setAttribute('current-td-num', td_num);
            // span.classList.add('trivia-name');
            // // プログラミング言語セット
            // parent_td.appendChild(div).appendChild(span).innerText = p_lang_name;
            // // プログラミング言語カラーセット
            // parent_td.querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;

            // let trivia_tag = document.querySelector('.tag-id-' + trivia_id);

            // // 開始ポジション
            // let pos_x = Math.floor(Math.random() * (tag_size * 0.5));
            // let pos_y = Math.floor(Math.random() * (tag_size * 0.5));
            // // アニメーション
            // let animation_move_sec = Math.floor((Math.random() * 10) + 6);
            // let animation_view_sec = Math.floor((Math.random() * 5) + 3);
            // let animation_kind = '';
            // // アニメーション振り分け
            // let animation_val = Math.floor(Math.random() * 10);
            // switch (animation_val) {
            //     case 0: animation_kind = 'tag_move_0';
            //         break;
            //     case 1: animation_kind = 'tag_move_1';
            //         break;
            //     case 2: animation_kind = 'tag_move_2';
            //         break;
            //     case 3: animation_kind = 'tag_move_3';
            //         break;
            //     case 4: animation_kind = 'tag_move_4';
            //         break;
            //     case 5: animation_kind = 'tag_move_5';
            //         break;
            //     case 6: animation_kind = 'tag_move_6';
            //         break;
            //     case 7: animation_kind = 'tag_move_7';
            //         break;
            //     case 8: animation_kind = 'tag_move_8';
            //         break;
            //     case 9: animation_kind = 'tag_move_9';
            //         break;
            //     default: animation_kind = 'tag_move_0';
            //         break;
            // }
            // tag_content.push(animation_kind);
            // // スタイルセット
            // trivia_tag.style.webkitTransitionProperty = "-webkit-transform";
            // trivia_tag.style.webkitTransitionProperty = "all";
            // trivia_tag.style.webkitTransitionDelay = "0.2s";
            // trivia_tag.style.webkitTransitionDuration = "0.5s";
            // trivia_tag.style.webkitTransitionTimingFunction = "ease-in-out";

            // trivia_tag.style.position = 'absolute';
            // trivia_tag.style.top = pos_x + 'px';
            // trivia_tag.style.left = pos_y + 'px';
            // trivia_tag.style.width = tag_size + 'px';
            // trivia_tag.style.height = tag_size + 'px';
            // trivia_tag.style.animation = 'tagview ' + animation_view_sec + 's 1';
            // // タグの出現が終わり次第動かす
            // trivia_tag.addEventListener('animationend', function () {
            //     trivia_tag.style.animationName = '';
            //     trivia_tag.classList.add(animation_kind);
            //     trivia_tag.classList.add('view_end');
            //     trivia_tag.style.animationIterationCount = 'infinite';
            //     trivia_tag.style.animationDuration = animation_move_sec + 's';
            //     trivia_tag.style.animationDirection = 'alternate';
            //     trivia_tag.style.webkitTransition = 'all 0.5s ease-in-out';
            // });

            // trivia_tag.addEventListener('click', function (e) {
            //     // 描画が終了していれば
            //     if (trivia_tag.classList.contains('view_end')) {
            //         // console.log(trivia_tag.getAttribute('current-td-num'));

            //         let current_td_num = trivia_tag.getAttribute('current-td-num');

            //         let temp = document.querySelector('.temp');
            //         let temp_text = temp.innerText;

            //         // モーダルの要素をクラス名で取得↑みたいな
            //         let post_area = document.querySelector('.post-area');
            //         let modal_hide = document.querySelector('.hide-box');

            //         // 書き込む様相取得
            //         let modal_p_lang = document.querySelector('.moda-p-lang');
            //         // let modal_article_area = document.querySelector('.modal-article-area');
            //         let modal_span = document.querySelector('.p-lang-span');
            //         let modal_article_txt = document.querySelector('.modal-article-txt');


            //         if (!temp_text) {
            //             temp.innerText = current_td_num;

            //             // モーダル表示ON
            //             modal_hide.style.display = 'block';
            //             post_area.style.display = 'block'

            //             // innerTextでtag_contentの中身を取得したモーダルの要素に書き込み
            //             modal_span.innerText = p_lang_name;
            //             modal_article_txt.innerText = data.article;

            //         } else {
            //             temp.innerText = '';
            //             modal_hide.style.display = 'none';
            //             post_area.style.display = 'none';
            //         }
            //     }


            // });
        });

        // Fetch・DOM操作
        this.installationGetTag(total_td);
        this.getPcolor();
    }
    /*=======================================================================
     methods
    =======================================================================*/


    sample1 = (trivia_id, td_num, p_lang_name, p_lang_color_code, parent_td) => {
        let div = document.createElement('div');
        let span = document.createElement('span');

        // タグを生成後、配置
        div.classList.add('trivia-tag');
        div.classList.add('tag-id-' + trivia_id);
        div.setAttribute('current-td-num', td_num);
        span.classList.add('trivia-name');
        // プログラミング言語セット
        parent_td.appendChild(div).appendChild(span).innerText = p_lang_name;
        // プログラミング言語カラーセット
        parent_td.querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;
    }

    sample2 = (trivia_id, p_lang_name, article, tag_size) => {
        let trivia_tag = document.querySelector('.tag-id-' + trivia_id);

        // 開始ポジション
        let pos_x = Math.floor(Math.random() * (tag_size * 0.5));
        let pos_y = Math.floor(Math.random() * (tag_size * 0.5));
        // アニメーション
        let animation_move_sec = Math.floor((Math.random() * 10) + 6);
        let animation_view_sec = Math.floor((Math.random() * 5) + 3);
        let animation_kind = '';
        // アニメーション振り分け
        let animation_val = Math.floor(Math.random() * 10);
        switch (animation_val) {
            case 0: animation_kind = 'tag_move_0';
                break;
            case 1: animation_kind = 'tag_move_1';
                break;
            case 2: animation_kind = 'tag_move_2';
                break;
            case 3: animation_kind = 'tag_move_3';
                break;
            case 4: animation_kind = 'tag_move_4';
                break;
            case 5: animation_kind = 'tag_move_5';
                break;
            case 6: animation_kind = 'tag_move_6';
                break;
            case 7: animation_kind = 'tag_move_7';
                break;
            case 8: animation_kind = 'tag_move_8';
                break;
            case 9: animation_kind = 'tag_move_9';
                break;
            default: animation_kind = 'tag_move_0';
                break;
        }
        // tag_content.push(animation_kind);
        // スタイルセット
        trivia_tag.style.webkitTransitionProperty = "-webkit-transform";
        trivia_tag.style.webkitTransitionProperty = "all";
        trivia_tag.style.webkitTransitionDelay = "0.2s";
        trivia_tag.style.webkitTransitionDuration = "0.5s";
        trivia_tag.style.webkitTransitionTimingFunction = "ease-in-out";

        trivia_tag.style.position = 'absolute';
        trivia_tag.style.top = pos_x + 'px';
        trivia_tag.style.left = pos_y + 'px';
        trivia_tag.style.width = tag_size + 'px';
        trivia_tag.style.height = tag_size + 'px';
        trivia_tag.style.animation = 'tagview ' + animation_view_sec + 's 1';
        // タグの出現が終わり次第動かす
        trivia_tag.addEventListener('animationend', function () {
            trivia_tag.style.animationName = '';
            trivia_tag.classList.add(animation_kind);
            trivia_tag.classList.add('view_end');
            trivia_tag.style.animationIterationCount = 'infinite';
            trivia_tag.style.animationDuration = animation_move_sec + 's';
            trivia_tag.style.animationDirection = 'alternate';
            trivia_tag.style.webkitTransition = 'all 0.5s ease-in-out';
        });

        trivia_tag.addEventListener('click', function (e) {
            // 描画が終了していれば
            if (trivia_tag.classList.contains('view_end')) {
                // console.log(trivia_tag.getAttribute('current-td-num'));

                let current_td_num = trivia_tag.getAttribute('current-td-num');

                let temp = document.querySelector('.temp');
                let temp_text = temp.innerText;

                // モーダルの要素をクラス名で取得↑みたいな
                let post_area = document.querySelector('.post-area');
                let modal_hide = document.querySelector('.hide-box');

                // 書き込む様相取得
                let modal_p_lang = document.querySelector('.moda-p-lang');
                // let modal_article_area = document.querySelector('.modal-article-area');
                let modal_span = document.querySelector('.p-lang-span');
                let modal_article_txt = document.querySelector('.modal-article-txt');


                if (!temp_text) {
                    temp.innerText = current_td_num;

                    // モーダル表示ON
                    modal_hide.style.display = 'block';
                    post_area.style.display = 'block'

                    // innerTextでtag_contentの中身を取得したモーダルの要素に書き込み
                    modal_span.innerText = p_lang_name;
                    modal_article_txt.innerText = article;

                } else {
                    temp.innerText = '';
                    modal_hide.style.display = 'none';
                    post_area.style.display = 'none';
                }
            }


        });
    }

    // 言語情報取得
    getPcolor = () => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/p_lang_color')
            .then(response => response.json())
            .then((data) => {
                this.setPcolor(data);
            })
            .catch(err => console.error(err))
    }


    /**
     * @description テーブル計算
     * @param ×
     * @returns ×
     */
    calculateTable = () => {
        // テーブルサイズ
        let table_size_width = Math.floor(window.innerWidth * 0.9 / 10) * 10;
        let table_size_height = Math.floor(window.innerHeight * 0.7 / 10) * 10;
        // 初期値
        let tag_size = 0;
        let td_num = 0;
        let tr_num = 0;
        let font_size = 0;
        // td数
        if (table_size_width < 450) {
            td_num = 3;
        } else if (table_size_width >= 450 && table_size_width < 600) {
            td_num = 3;
        } else if (table_size_width >= 600 && table_size_width < 700) {
            td_num = 4;
        } else if (table_size_width >= 600 && table_size_width < 700) {
            td_num = 5;
        } else if (table_size_width >= 700 && table_size_width < 800) {
            td_num = 5;
        } else if (table_size_width >= 800 && table_size_width < 900) {
            td_num = 6;
        } else if (table_size_width >= 900 && table_size_width < 1000) {
            td_num = 7;
        } else if (table_size_width >= 1000 && table_size_width < 1200) {
            td_num = 8;
        } else if (table_size_width >= 1200 && table_size_width < 1400) {
            td_num = 9;
        } else if (table_size_width >= 1400) {
            td_num = 10;
        }
        // tr数
        if (table_size_height < 450) {
            tr_num = 3;
        } else if (table_size_height >= 450 && table_size_height < 600) {
            tr_num = 4;
        } else if (table_size_height >= 600 && table_size_height < 700) {
            tr_num = 5;
        } else if (table_size_height >= 700 && table_size_height < 800) {
            tr_num = 5;
        } else if (table_size_height >= 800 && table_size_height < 900) {
            tr_num = 5;
        } else if (table_size_height >= 900 && table_size_height < 1000) {
            tr_num = 6;
        } else if (table_size_height >= 1000 && table_size_height < 1100) {
            tr_num = 7;
        } else if (table_size_height >= 1100) {
            tr_num = 7;
        }
        // タグ関係
        let tag_width = (table_size_width / td_num) * 0.62;
        let tag_height = (table_size_height / tr_num) * 0.62;
        let tag_num = Math.floor((td_num * tr_num) * 0.8);
        // カラム総数
        let total_td = td_num * tr_num;
        // タグサイズ小さい方を採用(縦<>横)
        if (tag_width >= tag_height) {
            tag_size = Math.floor(tag_height);
        } else {
            tag_size = Math.floor(tag_width);
        }
        // カラム総数によってフォントサイズ変更
        if (total_td >= 50) {
            font_size = 12;
        } else if (total_td >= 40) {
            font_size = 11;
        } else if (total_td >= 30) {
            font_size = 10;
        } else if (total_td >= 20) {
            font_size = 8;
        } else if (total_td >= 18) {
            font_size = 7;
        } else if (total_td >= 15) {
            font_size = 7;
        } else if (total_td >= 10) {
            font_size = 6;
        } else {
            font_size = 5;
        }
        // stateに値をセット
        this.setState({ TD_NUM: td_num });
        this.setState({ TR_NUM: tr_num });
        this.setState({ TOTAL_TD: total_td });
        this.setState({ TAG_SIZE: tag_size });
        this.setState({ TAG_NUM: tag_num });
        this.setState({ TABLE_SIZE_WIDTH: table_size_width });
        this.setState({ TABLE_SIZE_HEIGHT: table_size_height });
        this.setState({ FONT_SIZE: font_size });
        // 初回のDOM操作を回避
        if (this.state.TAG_RANDUM_ARR.length !== 0) {
            this.installationGetTag(total_td);
        }
    }
    /**
     * @description TD数の乱数配列を取得⇒タグをランダム配置
     * @param {Int} total_td | TDの総数
     * @returns ×
     */
    installationGetTag = (total_td) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/tagrandum/' + total_td)
            .then(response => response.json())
            .then((data) => {
                let trivia_num = this.state.TAG_NUM;
                let randum = data.randum;
                // 豆知識取得
                this.getTrivia(randum, trivia_num);
            })
            .catch(err => console.error(err))
    }
    /**
     * @description 豆知識取得
     * @param {Array} randum | 乱数配列
     * @param {Int} trivia_num | 取得する豆知識の個数
     * @returns ×
     */
    getTrivia = (randum, trivia_num) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/trivia/' + trivia_num)
            .then(response => response.json())
            .then((data) => {
                let tag_size = this.state.TAG_SIZE;
                let tag_num = this.state.TAG_NUM;
                let randum_array = randum;
                let trivia = data.trivia;
                // タグを生成
                this.tagGeneration(tag_size, randum_array, tag_num, trivia);
                // 乱数配列をセット
                this.setTagNum(randum);
                this.setTrivia(data);
            })
            .catch(err => console.error(err))
    }

    // 言語カラーセット
    setPcolor = (data) => {
        this.setState({ p_lang_color: data.color });
    }
    /**
     * @description タグの乱数をstateにセット
     * @param {Array} randum | 乱数配列
     * @returns ×
     */
    setTagNum = (randum) => {
        this.setState({ TAG_RANDUM_ARR: randum });
    }
    /**
     * @description 豆知識をstateにセット
     * @param {Object} data | 豆知識
     * @returns ×
     */
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.trivia });
    }


    setModal = (flag) => {
        this.setState({ MODAL_FLAG: flag });
    }


    onClickTag = (trivia_tag, tag_content, font_size, M_FLAG) => {
        trivia_tag.addEventListener('click', function (e) {
            // 描画が終了していれば
            if (trivia_tag.classList.contains('view_end')) {
                // console.log(trivia_tag.getAttribute('current-td-num'));

                let current_td_num = trivia_tag.getAttribute('current-td-num');

                let temp = document.querySelector('.temp');
                let temp_text = temp.innerText;

                // tag_contentの中身取得
                let p_lang_name = tag_content[0];
                let trivia_id = tag_content[1];
                let p_lang_color_code = tag_content[2];
                let article = tag_content[3];

                // モーダルの要素をクラス名で取得↑みたいな
                let post_area = document.querySelector('.post-area');
                let modal_hide = document.querySelector('.hide-box');

                // 書き込む様相取得
                let modal_p_lang = document.querySelector('.moda-p-lang');
                // let modal_article_area = document.querySelector('.modal-article-area');
                let modal_span = document.querySelector('.p-lang-span');
                let modal_article_txt = document.querySelector('.modal-article-txt');


                if (!temp_text) {
                    temp.innerText = current_td_num;

                    // モーダル表示ON
                    modal_hide.style.display = 'block';
                    post_area.style.display = 'block'

                    // innerTextでtag_contentの中身を取得したモーダルの要素に書き込み
                    modal_span.innerText = p_lang_name;
                    modal_article_txt.innerText = article;

                } else {
                    temp.innerText = '';
                    modal_hide.style.display = 'none';
                    post_area.style.display = 'none';
                }
            }


        });
    }

    /**
 * @description 投稿エリア非表示
 * @param ×
 * @returns ×
 */
    closeModal = () => {
        let modal_hide = document.querySelector('.hide-box');
        let post_area = document.querySelector('.post-area');
        let ins_check_area = document.querySelector('.ins-check-area');
        // 投稿ボタン
        let post_btn = document.getElementById('t-post-btn');


        let temp = document.querySelector('.temp');
        temp.innerText = '';


        // 送信エリア非表示
        modal_hide.style.display = 'none';
        post_area.style.display = 'none';
        // 完了メッセージ削除
        // while (ins_check_area.firstChild) {
        //     ins_check_area.removeChild(ins_check_area.firstChild);
        // }
        // if (post_btn.classList.contains('btn-02') && !(post_btn.classList.contains('btn-disable'))) {
        //     // 投稿ボタンスタイルリセット
        //     post_btn.classList.add('btn-disable');
        //     post_btn.classList.remove('btn-02');
        // }
    }

    /**
     * @description テーブルを生成
     * @param {Int} d | TD数
     * @param {Int} r | TR数
     * @returns {String} table | tableを生成するHTMLの文字列
     */
    renderTable = (d, r) => {
        /* 初期値 */
        //tableサイズ
        let table_width = this.state.TABLE_SIZE_WIDTH;
        let table_height = this.state.TABLE_SIZE_HEIGHT;
        //trサイズ
        let tr_width = table_width;
        let tr_height = Math.floor(table_height / r);
        //tdサイズ
        let td_width = Math.floor(table_width / d) - 2;
        let td_height = tr_height;

        // テーブル
        let table = "<table width= '" + table_width + "' height='" + table_height + "' class='trvia-table'>";
        let num = 0;
        // tr生成
        for (let i = 0; i < r; i++) {
            table += "<tr width= '" + tr_width + "' height= '" + tr_height + "' class='trvia-tr tr-id-" + i + "'>";
            // td生成
            for (let j = 0; j < d; j++) {
                table += "<td width= '" + td_width + "' height= '" + td_height + "' class='trvia-td td-id-" + num + "'></td>";
                num++;
            }
            table += "</tr>";
        }
        table += "</table>";

        return table;
    }
    /**
     * @description タグを生成
     * @param {Int} tag_size | タグサイズ
     * @param {Array} randum_array | 乱数配列
     * @param {Int} tag_num | 出力タグ数
     * @param {Object} trivia | 豆知識
     * @returns ×
     */
    tagGeneration = (tag_size, randum_array, tag_num, trivia) => {
        // 乱数配列が存在する場合
        if (randum_array) {
            // td取得
            let trivia_td = document.querySelectorAll('.trvia-td');
            // 豆知識のカラム数
            let trivia_td_len = trivia_td.length;
            // 乱数配列の長さ
            let randum_ary_len = randum_array.length;
            // 全てのタグをリセット
            for (let i = 0; i < trivia_td_len; i++) {
                while (trivia_td[i].firstChild) {
                    trivia_td[i].removeChild(trivia_td[i].firstChild);
                }
            }
            // 総TD数と乱数配列の数の整合性チェック
            if (trivia_td_len === randum_ary_len) {
                let tag_content = [];
                // タグをランダムに設置
                for (let i = 0; i < trivia_td_len; i++) {
                    // タグの個数分ループ
                    if (i === tag_num) {
                        break;
                    }

                    // 乱数取り出し
                    let tn = randum_array[i];

                    // 豆知識情報セット
                    let p_lang_name = trivia[i].p_lang_name;
                    let trivia_id = trivia[i].trivia_id;
                    let p_lang_color_code = trivia[i].p_lang_color_code;
                    let article = trivia[i].article;

                    tag_content[i] = [];

                    tag_content[i].push(p_lang_name);
                    tag_content[i].push(trivia_id);
                    tag_content[i].push(p_lang_color_code);
                    tag_content[i].push(article);
                    tag_content[i].push(tn);

                    // タグを生成後、配置
                    let div = document.createElement('div');
                    let span = document.createElement('span');
                    div.classList.add('trivia-tag');
                    div.classList.add('tag-id-' + trivia_id);
                    div.setAttribute('current-td-num', tn);
                    span.classList.add('trivia-name');
                    // プログラミング言語セット
                    trivia_td[tn].appendChild(div).appendChild(span).innerText = p_lang_name;
                    // プログラミング言語カラーセット
                    trivia_td[tn].querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;
                }
                // 生成した後タグを取得
                let trivia_tag = document.querySelectorAll('.trivia-tag');
                // タグにスタイル適応
                this.tagStyleAddition(trivia_tag, tag_size, tag_content);
            }
        }
    }
    /**
     * @description タグのスタイル適応処理(CSSアニメーション振り分け含む)
     * @param {Object} trivia_tag | 生成された豆知識タグ要素
     * @param {Int} tag_size | タグの大きさ
     * @returns ×
     */
    tagStyleAddition = (trivia_tag, tag_size, tag_content) => {
        // スタイル適応繰り返し
        for (let i = 0; i < trivia_tag.length; i++) {
            // 開始ポジション
            let pos_x = Math.floor(Math.random() * (tag_size * 0.5));
            let pos_y = Math.floor(Math.random() * (tag_size * 0.5));
            // アニメーション
            let animation_move_sec = Math.floor((Math.random() * 10) + 6);
            let animation_view_sec = Math.floor((Math.random() * 5) + 3);
            let animation_kind = '';
            // アニメーション振り分け
            let animation_val = Math.floor(Math.random() * 10);
            switch (animation_val) {
                case 0: animation_kind = 'tag_move_0';
                    break;
                case 1: animation_kind = 'tag_move_1';
                    break;
                case 2: animation_kind = 'tag_move_2';
                    break;
                case 3: animation_kind = 'tag_move_3';
                    break;
                case 4: animation_kind = 'tag_move_4';
                    break;
                case 5: animation_kind = 'tag_move_5';
                    break;
                case 6: animation_kind = 'tag_move_6';
                    break;
                case 7: animation_kind = 'tag_move_7';
                    break;
                case 8: animation_kind = 'tag_move_8';
                    break;
                case 9: animation_kind = 'tag_move_9';
                    break;
                default: animation_kind = 'tag_move_0';
                    break;
            }
            tag_content[i].push(animation_kind);
            // スタイルセット
            trivia_tag[i].style.webkitTransitionProperty = "-webkit-transform";
            trivia_tag[i].style.webkitTransitionProperty = "all";
            trivia_tag[i].style.webkitTransitionDelay = "0.2s";
            trivia_tag[i].style.webkitTransitionDuration = "0.5s";
            trivia_tag[i].style.webkitTransitionTimingFunction = "ease-in-out";

            trivia_tag[i].style.position = 'absolute';
            trivia_tag[i].style.top = pos_x + 'px';
            trivia_tag[i].style.left = pos_y + 'px';
            trivia_tag[i].style.width = tag_size + 'px';
            trivia_tag[i].style.height = tag_size + 'px';
            trivia_tag[i].style.animation = 'tagview ' + animation_view_sec + 's 1';
            // タグの出現が終わり次第動かす
            trivia_tag[i].addEventListener('animationend', function () {
                trivia_tag[i].style.animationName = '';
                trivia_tag[i].classList.add(animation_kind);
                trivia_tag[i].classList.add('view_end');
                trivia_tag[i].style.animationIterationCount = 'infinite';
                trivia_tag[i].style.animationDuration = animation_move_sec + 's';
                trivia_tag[i].style.animationDirection = 'alternate';
                trivia_tag[i].style.webkitTransition = 'all 0.5s ease-in-out';
            });

            let font_size = this.state.FONT_SIZE;
            let m_flag = this.state.MODAL_FLAG;

            let trivia_td = document.querySelectorAll('.trvia-td');
            // this.onMouseOver(trivia_td[tag_content[i][4]].querySelector('.trivia-tag'), tag_content[i], animation_kind, font_size);
            this.onClickTag(trivia_td[tag_content[i][4]].querySelector('.trivia-tag'), tag_content[i], font_size, m_flag);
            // this.onClick(trivia_td[tag_content[i][4]].querySelector('.trivia-tag'), tag_content[i]);
            // this.onMouseOut(trivia_td[tag_content[i][4]].querySelector('.trivia-tag'), tag_content[i], animation_kind);
        }
    }

    // 豆知識送信
    sendTrivia = () => {
        let socket = this.state.socket;
        let trivia_txt = document.querySelector('.chat_area_tag').value;
        let p_lang_ids = document.querySelector('.p_lang_color');
        let idx = p_lang_ids.selectedIndex;
        let p_lang_id = p_lang_ids.options[idx].value;

        // [/] をエスケープ
        trivia_txt = encodeURIComponent(trivia_txt);


        let trivia_data = {
            article: trivia_txt,
            p_lang_id: p_lang_id
        }

        socket.emit('send_trivia', trivia_data);

        // trivia_txt.innerText = '';
    }

    render() {
        // TD・TR数に応じてテーブル作成
        let d = this.state.TD_NUM;
        let r = this.state.TR_NUM;
        const MAIN_TABLE = this.renderTable(d, r);


        // 言語セレクトメニュー
        let list = [];
        let p_color_list = this.state.p_lang_color;
        for (let i in p_color_list) {
            list.push(<option key={p_color_list[i].p_lang_id} value={p_color_list[i].p_lang_id}>{p_color_list[i].p_lang_name}</option>);
        }
        return (
            <div id="main">
                <div dangerouslySetInnerHTML={{ __html: MAIN_TABLE }} />
                <EventListener target="window" onResize={this.calculateTable} />
                <div className="container">
                    <div>
                        <select name="p_lang_color" className="p_lang_color">
                            {list}
                        </select>
                        <button onClick={() => this.sendTrivia()}>send</button>
                        <textarea className="chat_area_tag" />
                    </div>
                </div>
                <span className='temp' hidden></span>
                <div className="post-area">
                    <div className="post-area-inner">
                        <div className="chat-modal">
                            <div className="modal-p-lang">
                                <h2 className="p-lang-span"></h2>
                            </div>
                            <div className='modal-article-area'>
                                <p className='modal-article-txt'></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hide-box' onClick={this.closeModal}></div>
            </div>
        )
    }
}

export default ViewChat
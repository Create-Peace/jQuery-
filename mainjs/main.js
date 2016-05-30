$(function() {
        // 设置每一列的宽度
        var iWidth = 200;
        // 列间隔距离
        var iGap = 10;
        // 当前列的总数
        var iColumns = 0;
        //每列的实际宽度
        var iOuterWidth = iWidth + iGap;
        // 当时要添加图片的位位置
        var arrL = [];
        var arrT = [];
        //要加载的当前页数
        var iPage = 0;
        // 当前的加载标志
        var flag = true;
        // 数据的url
        var iUrl = 'http://www.wookmark.com/api/json/popular?callback=?';
        // 获取容器
        var oContainer = $("#container");
        // 获取进度条
        var oLoader = $('.loader');
        // 获取顶部页眉
        var oHeader = $('.header');

        setColumns();
        // console.log(iColumns);

        // 设置当前加载图片的left、top值
        for (var i = 0; i < iColumns; i++) {
            arrL.push(iOuterWidth * i);
            arrT.push(0);
        }
        // 最开始打开也页面时加载数据
        getData();

        // 向下滚动时
        $(window).on('scroll', function() {
            // 顶部页眉显示
            if ($(window).scrollTop() > 0) {
                oHeader.show();
            } else {
                oHeader.hide();
            }
            // 计算当前滚动的列的高度和可视区高度的和
            var iH = $(window).scrollTop() + $(window).innerHeight();

            var iMinIndex = getMin();

            if (arrT[iMinIndex] + oContainer.offset().top < iH) {
                iPage++;
                getData();
            }
        })

        // 当前窗口发生改变时重新排布
        $(window).on('resize', function() {
            // 记录原来的列数
            var oldColumns = iColumns;
            // 重新计算列
            setColumns();
            // 判断是否需要加载
            var iH = $(window).scrollTop() + $(window).innerHeight();

            var iMinIndex = getMin();

            if (arrT[iMinIndex] + oContainer.offset().top < iH) {
                iPage++;
                getData();
            }
            if (oldColumns == iColumns) {
                return;
            }
            // 重置位置值
            arrT = [];
            arrL = [];
            //再赋值
            for (var i = 0; i < iColumns; i++) {
                arrT.push(0);
                arrL.push(i * iOuterWidth);
            }
            // 重新设置图片的位置
            var aImgs = oContainer.find('img');

            aImgs.each(function() {
                var iMinIndex = getMin();
                $(this).animate({
                    left: arrL[iMinIndex],
                    top: arrT[iMinIndex]
                });
                arrT[iMinIndex] += $(this).height() + 10;
            })
        })

        // 设置当前的列数和容器的宽度
        function setColumns() {
            iColumns = Math.floor($(window).innerWidth() / iOuterWidth);
            if (iColumns < 3) {
                iColumns = 3;
            } else if (iColumns > 6) {
                iColumns = 6;
            }
            // 计算容器的宽度
            var oContWidth = iColumns * iOuterWidth - iGap;
            // 设置容器的宽度
            oContainer.css('width', oContWidth);

        }

        // 获取当前的最短列
        function getMin() {
            var temp = arrT[0];
            var _index = 0;
            for (var i = 0; i < arrT.length; i++) {
                //求出当前高度最小的列
                if (arrT[i] < temp) {
                    temp = arrT[i];
                    _index = i;
                }
            }
            return _index;
        }

        // 封装加载数据的函数
        function getData() {
            if (flag) {
                flag = false;
                // 请求数据
                $.getJSON(iUrl, 'page = ' + iPage, function(data) {
                    // console.log(data);
                    // 开始加载时显示加载进度条
                    oLoader.show();
                    // 将请求回来的数据添加到img标签中
                    $.each(data, function(index, obj) {
                        var oImg = $('<img />');
                        oImg.attr('src', obj.preview);
                        oContainer.append(oImg);
                        // 计算图片等比缩放后的高度
                        var iHeight = iWidth / obj.width * obj.height;
                        // 设置图片的宽度和高度
                        oImg.css({
                            width: iWidth,
                            height: iHeight
                        });
                        // 处理加载失败的图片
                        // $("img").error(function() {
                        //     $(this).hide();
                        // });
                        var iMinIndex = getMin();
                        // 设置位置
                        oImg.css({
                            left: arrL[iMinIndex],
                            top: arrT[iMinIndex]
                        });
                        // 添加图片后需要设置该列的高度
                        arrT[iMinIndex] += iHeight + 10;
                        oLoader.hide('3000');
                        flag = true;
                    })
                });
            }
        }

    }) //$(function(){ })结尾

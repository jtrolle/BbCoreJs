<div id="library-pane-wrapper" class="bb5-windowpane-wrapper windowpane-treeview">
    <div class="bb5-windowpane-tree ui-layout-pane ui-layout-west">
        <div class="ui-layout-north">
            <p><strong data-i18n="toolbar.selector.select_folder">{{ "select_a_mediafolder" | trans }}</strong></p>
            <div class="container-fluid"><div class="navbar-right toolbar-menu-ctn"></div></div>
        </div>



<div class="inner-center layout-overflow-scroll">
  <div class="bb5-windowpane-tree-inner">
    <!-- tree pane: tree wrapper -->
    <div class="bb5-windowpane-treewrapper">

        <div class="bb5-windowpane-treewrapper-inner jstree jstree-3 jstree-focused jstree-bb5">
          <div class="bb5-treeview mediaFolder-tree">
          </div>
        </div>
    </div>
    <!-- end tree pane: tree wrapper -->
  </div>
</div><!--/.inner-center-->

<div class="ui-layout-south">
</div><!--/.ui-layout-south-->
    </div>

    <div class="bb5-windowpane-main ui-layout-pane ui-layout-center">
      <div class="ui-layout-north">
        <div class="bb5-form-wrapper search-engine-ctn"></div><!--/.form-wrapper-->
        <div class="bb5-widget-toolbar list-options clearfix">
          <p class="bb5-widget-toolbar result-infos"></p>
          <ul class="pagination content-selection-pagination clearfix"></ul>
          <p class="pull-right">
            <button type="button" data-viewmode="grid" class="btn viewmode-btn btn-default-grey btn-ico bb5-sortasgrid fa fa-th-large"></button>
            <button type="button" data-viewmode="list" class="btn viewmode-btn btn-default-grey btn-ico bb5-sortaslist fa fa-list-ul"></button>
            <span class="select"><select class="max-per-page-selector"></select></span>
          </p>
        </div>
      </div><!--/.ui-layout-north-->

      <div class="inner-center layout-overflow-scroll data-list-ctn"></div><!--/.inner-center-->

    </div>
  </div>

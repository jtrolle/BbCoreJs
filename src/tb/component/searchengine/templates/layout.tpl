<div class="row search-engine">
      <div class="col-bb5-x">
        <div class="row form-group"><span class="col-bb5-100"><label for="form10" class="sr-only">{{ "title" | trans }}</label><input type="text" data-fieldName="title" class="form-control content-title" placeholder='{{ "title" | trans }}' id="form10"></span></div>
        <div class="row form-group">
          <div class="col-bb5-x">{{ "created_before" | trans }} : </div>
          <div class="col-bb5-24"><div class="input-group"><input type="text" data-fieldName="beforeDate" class="form-control disabled before-date bb5-datepicker" placeholder="dd/mm/aaaa"><span class="input-group-btn"><button class="btn btn-default-grey show-calendar" type="button"><i class="fa fa-calendar"></i></button></span></div></div>
          <div class="col-bb5-x">{{ "created_after" | trans }} : </div>
          <div class="col-bb5-24"><div class="input-group"><input type="text" data-fieldName="afterDate" class="form-control disabled after-date bb5-datepicker" placeholder="dd/mm/aaaa"><span class="input-group-btn"><button class="btn btn-default-grey show-calendar" type="button"><i class="fa fa-calendar"></i></button></span></div></div>
          <div class="col-bb5-x pull-right"><button class="btn btn-default-grey search-btn" type="button"><i class="fa fa-search"></i> {{"search" | trans}}</button></div>
        </div>
      </div>
    </div>

<li data-uid={{id}} class="bb5-selector-item">
    <p class="item-picture"><a title="{{title}}" href="javascript:;"><img alt="{{title}}" src="{{image}}"></a></p>
    <p class="item-ttl"><strong class="txt-highlight">{{title}}</strong></p>
    <p class="item-meta">
          {% if content.extra %}
             {% if content.extra.image_width %}
                <span>{{'media_width'|trans}} : {{content.extra.image_width}}px, {{'media_height'|trans}} : {{content.extra.image_height}}px, {{content.extra.file_size | bytesToSize}} </span>

            {% else %}
                <span> {{content.extra.filesize}} </span>
            {% endif %}
          {% endif %}
    </p>
    <div class="item-action">
        <p><button class="btn btn-simple btn-sm show-media-btn"><i class="fa fa-eye"></i>{{ "see" | trans }}</button></p>
        <p><button class="btn btn-simple btn-sm edit-media-btn"><i class="fa fa-pencil"></i>{{ "edit" | trans }}</button></p>
        <p><button class="btn btn-simple btn-sm del-media-btn"><i class="fa fa-trash-o"></i>{{"delete" | trans}}</button></p>
    </div>
</li>

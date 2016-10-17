<li data-uid={{id}} class="bb5-selector-item">
    <p class="item-picture"><a title="{{title}}" href="javascript:;"><img src="{{image}}"></a></p>
    <p class="item-ttl">{{smallTitle}}</p>
    <p class="item-meta">
          {% if content.extra %}
             {% if content.extra.image_width %}
                <span>{{'media_width'|trans}} : {{content.extra.image_width}}px, {{'media_height'|trans}} : {{content.extra.image_height}}px, {{content.extra.file_size | bytesToSize}} </span>

            {% else %}
                <span> {{content.extra.filesize}} </span>
            {% endif %}
          {% endif %}
    </p>
    <p>
        <a href="#" class="btn btn-default-grey addandclose-btn">{{ "choose" | trans }}</a>
    </p>
    <div class="item-action">
        <p><button class="btn btn-simple btn-sm show-media-btn"><i class="fa fa-eye"></i></button></p>
        <p><button class="btn btn-simple btn-sm edit-media-btn"><i class="fa fa-pencil"></i></button></p>
        <p><button class="btn btn-simple btn-sm del-media-btn"><i class="fa fa-trash-o"></i></button></p>
    </div>
</li>

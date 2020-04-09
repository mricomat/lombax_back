package com.lombax.service.sections;

import com.lombax.data.SectionModel;

import java.util.ArrayList;

public interface SectionsService {

    ArrayList<SectionModel> getSections(String userId, int genre);

}
